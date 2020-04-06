package com.example.springboot;

import com.example.springboot.util.utils;
import com.google.gson.Gson;
import org.hyperledger.fabric.sdk.Channel;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletRequest;

@RestController
public class QueryPeopleController {

	@RequestMapping("/getPeople")
	public String index(ServletRequest req) {
		Channel mychannel = null;
		try {
			mychannel = utils.mychannel;//utils.mychannelPool.borrowObject();


			String payload = utils.Query(mychannel,utils.HospitalCC,"getPatientInfo",req.getParameter("Credit_card"));
			//Gson gson = new Gson();
			//String[] object = gson.fromJson(payload, String[].class);
			//utils.mychannelPool.returnObject(mychannel);

			return payload;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}