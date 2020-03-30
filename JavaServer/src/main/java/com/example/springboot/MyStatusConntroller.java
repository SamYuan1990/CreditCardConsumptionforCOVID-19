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

import com.example.springboot.util.utils;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletRequest;
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
		String Cough=req.getParameter("Cough");
		String Chest_pain=req.getParameter("Chest_Pain");
		String Fever=req.getParameter("Fever");
		String ShareSpace=getShareSpaceInfo(req.getParameter("Credit_card"));
		String status = getstatusFromAI(Credit_Card,Cough,Chest_pain,Fever,ShareSpace);
		res.setStatus(status);
		Date d =new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		RecordToChain(Credit_Card,Cough,Chest_pain,Fever,sdf.format(d),status);
		return res;
	}

	private void RecordToChain(String credit_card, String cough, String chest_pain, String fever,String date, String status) {
		utils.Invoke(utils.HospitalCC,"createPatientInfo",credit_card,cough,chest_pain,fever,date,status);
	}

	private String getstatusFromAI(String credit_card, String cough, String chest_pain, String fever, String shareSpace) {
		return "success";
	}

	private static String getShareSpaceInfo(String Credit_card) {
		String payload = utils.Invoke(utils.MarketCC,"SearchRecentMarket",Credit_card);
		System.out.println(payload);
		payload = utils.Invoke(utils.HospitalCC,"getLocations");
		//if(contians)
		payload="true";
		//else
		payload="false";
		return payload;
	}

	private static String NewBlockInfo(String Credit_card) {
		String payload = utils.Invoke("mycc","query","a");
		System.out.println(payload);
		return payload;
	}
}
