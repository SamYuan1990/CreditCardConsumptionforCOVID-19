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
import com.example.springboot.dataModel.Status;
import com.example.springboot.util.AIClient;
import com.example.springboot.util.utils;

import com.google.gson.Gson;
import org.hyperledger.fabric.sdk.Channel;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletRequest;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Servlet implementation class CreateNeedServlet
 */
@RestController
public class MyStatusConntroller{
	private static final long serialVersionUID = 1L;
	private static int need_id = 1;

	@RequestMapping("/mystatus")
	public Object index(ServletRequest req){
		System.out.println(req);
		Status res = new Status();
		/*  
		let data ={
				status:"success"
			} 
		*/
		/*
		success
		warning
		danger
		 */
		String Credit_Card=req.getParameter("Credit_card");
		System.out.println(Credit_Card);
		String Cough=req.getParameter("Cough");
		System.out.println(Cough);
		String Chest_pain=req.getParameter("Chest_Pain");
		System.out.println(Chest_pain);
		String Fever=req.getParameter("Fever");
		System.out.println(Fever);
		String ShareSpace=getShareSpaceInfo(req.getParameter("Credit_card"));
		System.out.println(ShareSpace);
		String status = getstatusFromAI(Credit_Card,Cough,Chest_pain,Fever,ShareSpace);
		res.setStatus(status);
		Date d =new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		RecordToChain(Credit_Card,Cough,Chest_pain,Fever,sdf.format(d),status);
		return res;
	}

	public static void RecordToChain(String credit_card, String cough, String chest_pain, String fever,String date, String status) {
		Channel mychannel = null;
		try {
			mychannel = utils.mychannelPool.borrowObject();
			utils.Invoke(mychannel,utils.HospitalCC,"createPatientInfo",credit_card,cough,chest_pain,fever,date,status);
			utils.mychannelPool.returnObject(mychannel);
		} catch (Exception e) {
			e.printStackTrace();
		}	}

	private String getstatusFromAI(String credit_card, String cough, String chest_pain, String fever, String shareSpace) {
		String Cough="No";
		if (cough.equals("true")){
			Cough="Yes";
		}
		String Chest_pain="No";
		if (chest_pain.equals("true")){
			Chest_pain="Yes";
		}
		String rs = "";
		try {
			rs = AIClient.ReqsetTOAI(credit_card,Cough,Chest_pain,fever,shareSpace);
		} catch (IOException e) {
			e.printStackTrace();
		}

		return rs.toLowerCase();
	}

	private static String getShareSpaceInfo(String Credit_card) {
		Channel mychannel = null;
		try {
			mychannel = utils.mychannelPool.borrowObject();

			String RecentLocations = utils.Query(mychannel, utils.MarketCC, "SearchRecentMarket", Credit_card);
			System.out.println(RecentLocations);
			String curentLocations = utils.Query(mychannel, utils.HospitalCC, "getLocations");
			Gson gson = new Gson();
			MarketInfo[] currentobject = gson.fromJson(curentLocations, MarketInfo[].class);
			MarketInfo[] RecentLocation = gson.fromJson(RecentLocations, MarketInfo[].class);
			String payload = "No";
			if (currentobject != null) {
				for (MarketInfo s : currentobject) {
					for (MarketInfo i : RecentLocation) {
						if (s.equals(i)) {
							payload = "Yes";
							break;
						}
					}
				}
			}
			utils.mychannelPool.returnObject(mychannel);
			return payload;
		}
		catch(Exception e){
			e.printStackTrace();
		}
		return "";
		}
}
