/****************************************************** 
 *  Copyright 2019 IBM Corporation 
 *  Licensed under the Apache License, Version 2.0 (the "License"); 
 *  you may not use this file except in compliance with the License. 
 *  You may obtain a copy of the License at 
 *  http://www.apache.org/licenses/LICENSE-2.0 
 *  Unless required by applicable law or agreed to in writing, software 
 *  distributed under the License is distributed on an "AS IS" BASIS, 
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 *  See the License for the specific language governing permissions and 
 *  limitations under the License.
 */ 

package com.example.springboot;

import com.example.springboot.dataModel.MarketInfo;
import com.example.springboot.util.utils;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletRequest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;
import java.util.TreeSet;

/**
 * Servlet implementation class CreateNeedServlet
 */
@RestController
public class NewConfirmConntroller {
	private static final long serialVersionUID = 1L;
	private static int need_id = 1;

	@RequestMapping("/newConfirmed")
	public Object index(ServletRequest req){
		String Credit_Card=req.getParameter("Credit_card");
		String Cough=req.getParameter("Cough");
		String Chest_pain=req.getParameter("Chest_Pain");
		String Fever=req.getParameter("Fever");
		String status = utils.danger;
		Date d =new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Confirmed(Credit_Card,Cough,Chest_pain,Fever,sdf.format(d),status);
		return utils.danger;
	}

	private void Confirmed(String credit_Card, String cough, String chest_pain, String fever, String date, String status) {
		utils.Invoke(utils.HospitalCC,"createConfirmed",credit_Card,cough,chest_pain,fever,date,status);
		String RecentLocations = utils.Invoke(utils.MarketCC,"SearchRecentMarket",credit_Card);
		String curentLocations = utils.Invoke(utils.HospitalCC,"getLocations");
		System.out.println("Current in blokchain:"+curentLocations);
		Gson gson = new Gson();
		MarketInfo[] currentobject = gson.fromJson(curentLocations, MarketInfo[].class);
		MarketInfo[] Recentobject = gson.fromJson(RecentLocations,MarketInfo[].class);
		Set<MarketInfo> set = new TreeSet<MarketInfo>();
		if(currentobject!=null) {
			for (MarketInfo s : currentobject) {
				if (s != null) {
					System.out.println("add from current object:" + s);
					set.add(s);
				}
			}
		}
		if(Recentobject!=null) {
			for (MarketInfo s : Recentobject) {
				if (s != null) {
					System.out.println("add from Market:" + s);
					set.add(s);
				}
			}
		}
		MarketInfo[] mergeRS = new MarketInfo[set.size()];
		int i=0 ;
		for(MarketInfo s:set){
			System.out.println("Get: "+s);
			mergeRS[i] = s;
			i++;
		}
		System.out.println("recent Market for "+credit_Card + " is "+RecentLocations);
		System.out.println(gson.toJson(mergeRS));
		utils.Invoke(utils.HospitalCC,"UpdateLocation",gson.toJson(mergeRS));
	}
}
