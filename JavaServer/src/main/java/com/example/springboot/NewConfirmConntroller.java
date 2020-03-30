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
		Confirmed(Credit_Card);
		return "success";
	}

	private void Confirmed(String credit_card) {
		utils.Invoke(utils.HosptialCC,"createConfirmed",credit_card);
		String payload = utils.Invoke(utils.MarketCC,"SearchRecentMarket",credit_card);
		utils.Invoke(utils.HosptialCC,"UpdateMarket",payload);
	}
}
