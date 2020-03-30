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

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;

import com.example.springboot.util.utils;
import com.google.protobuf.ByteString;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Servlet implementation class CreateNeedServlet
 */
@RestController
public class DataController{
	private static final long serialVersionUID = 1L;
	private static int need_id = 1;

	@RequestMapping("/data")
	public Object index(){
		Data res = new Data();
		 int randomNumber = (int)(Math.random() * 100) + 1;
		/*
		let data = 
			{
				data : {},
				dataArray : [0,100000],
				range: [{label: "Red",
				usage: Math.round(Math.random()*30)},{label: "Yellow",
				usage: Math.round(Math.random()*30)},{label: "Green",
				usage: Math.round(Math.random()*30)}],
				BarRed: [
					{letter:"Mar-3",frequency:Math.round(Math.random()*30)}
					,{letter:"Mar-4",frequency:Math.round(Math.random()*20)},{letter:"Mar-5",frequency:Math.round(Math.random()*10)}],
				BarYellow: [{letter:"Mar-3",frequency:Math.round(Math.random()*30)},{letter:"Mar-4",frequency:Math.round(Math.random()*20)},{letter:"Mar-5",frequency:Math.round(Math.random()*10)}],
				BarGreen: [{letter:"Mar-3",frequency:Math.round(Math.random()*30)},{letter:"Mar-4",frequency:Math.round(Math.random()*20)},{letter:"Mar-5",frequency:Math.round(Math.random()*30)}]
			};
		 */
		int[] dataArray = {0,100000};
		res.dataArray = dataArray;
		Label[] range={new Label("Red",randomNumber),new Label("Yellow",randomNumber),new Label("Green",randomNumber)};
		res.range = range;
		Bar[] barRed= {new Bar("Mar-3",randomNumber),new Bar("Mar-4",randomNumber),new Bar("Mar-5",randomNumber)};
		res.BarRed = barRed;
		Bar[] barYellow= {new Bar("Mar-3",randomNumber),new Bar("Mar-4",randomNumber),new Bar("Mar-5",randomNumber)};
		res.BarYellow = barYellow;
		Bar[] barGreen= {new Bar("Mar-3",randomNumber),new Bar("Mar-4",randomNumber),new Bar("Mar-5",randomNumber)};
		res.BarGreen =  barGreen;
		return res;
	}

	private static String createNeed(JSONObject req) {
		String payload = utils.Invoke("mycc","query","a");
		System.out.println(payload);
		return payload;
	}

}
