package com.example.springboot;

import com.example.springboot.dataModel.MarketInfo;
import com.example.springboot.util.statusRepot;
import com.example.springboot.util.utils;
import com.google.gson.Gson;
import org.hyperledger.fabric.sdk.Channel;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletRequest;
import java.util.ArrayList;
import java.util.Map;

@RestController
public class QueryPeopleController {

	@RequestMapping("/getPeople")
	public Object index(ServletRequest req) {
		statusRepot data =new statusRepot();
		Channel mychannel = null;
		try {
			mychannel = utils.mychannel;
			String payload = utils.Query(mychannel,utils.HospitalCC,"getPatientInfo",req.getParameter("Credit_card"));
			Gson gson = new Gson();
			Map<String,String> personInfo = gson.fromJson(payload, Map.class);
			System.out.println(personInfo);
			data.name=personInfo.get("credit_card");
			if(!personInfo.get("cough").equals("No")){
				statusRepot Cough = new statusRepot();
				Cough.name="Cough";
				data.addChild(Cough);
			}
			if(!personInfo.get("chest_pain").equals("No")){
				statusRepot chest_pain = new statusRepot();
				chest_pain.name="chest_pain";
				data.addChild(chest_pain);
			}
			if(Integer.valueOf(personInfo.get("fever"))>0){
				statusRepot fever = new statusRepot();
				fever.name="fever";
				data.addChild(fever);
			}


			String RecentLocations = utils.Query(mychannel, utils.MarketCC, "SearchRecentMarket", req.getParameter("Credit_card"));
			String curentLocations = utils.Query(mychannel, utils.HospitalCC, "getLocations");

			MarketInfo[] currentobject = gson.fromJson(curentLocations, MarketInfo[].class);
			MarketInfo[] RecentLocation = gson.fromJson(RecentLocations, MarketInfo[].class);
			//ArrayList<MarketInfo> target= new ArrayList<MarketInfo>();
			if (currentobject != null) {
				for (MarketInfo s : currentobject) {
					for (MarketInfo i : RecentLocation) {
						if (s.equals(i)) {
							//target.add(i);
							statusRepot target = new statusRepot();
							target.name=i.City+"_"+i.Branch;
							data.addChild(target);
						}
					}
				}
			}

			return data;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}