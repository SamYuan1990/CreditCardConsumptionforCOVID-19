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

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.example.springboot.util.utils;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Servlet implementation class CreateNeedServlet
 */
@RestController
public class DataController{
	private static final long serialVersionUID = 1L;
	private static int need_id = 1;
	private static int recents = 3;

	@RequestMapping("/data")
	public Object index(){
		Data res = new Data();
		//int randomNumber = (int)(Math.random() * 100) + 1;
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
		Label[] range={new Label("Red",GetTotalNumberByStatus(utils.danger)),
				new Label("Yellow",GetTotalNumberByStatus(utils.warn)),
				new Label("Green",GetTotalNumberByStatus(utils.success))};
		res.range = range;
		Bar[] barRed= new Bar[recents];
		Date d1 = new Date();
		for(int i=0;i<recents;i++){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			barRed[i]=new Bar(sdf.format(d1),GetTotalNumberByStatusAndDate(utils.danger,d1));
			d1=yesterday(d1);
		}
		res.BarRed=barRed;
		Bar[] barYellow= new Bar[recents];
		d1 = new Date();
		for(int i=0;i<recents;i++){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			barYellow[i]=new Bar(sdf.format(d1),GetTotalNumberByStatusAndDate(utils.warn,d1));
			d1=yesterday(d1);
		}
		res.BarYellow=barYellow;
		Bar[] barGreen = new Bar[recents];
		d1 = new Date();
		for(int i=0;i<recents;i++){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			barGreen[i]=new Bar(sdf.format(d1),GetTotalNumberByStatusAndDate(utils.success,d1));
			d1=yesterday(d1);
		}
		res.BarGreen=barGreen;
		return res;
	}

	private static int GetTotalNumberByStatus(String status) {
		String payload = utils.Invoke(utils.HospitalCC,"queryByStatus",status);
		return Integer.valueOf(payload);
	}

	private static int GetTotalNumberByStatusAndDate(String status,Date date) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String payload = utils.Invoke(utils.HospitalCC,"queryByStatusDate",status,sdf.format(date));
		return Integer.valueOf(payload);
	}

	public Date yesterday(Date today) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(today);
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - 1);
		return calendar.getTime();
	}

}
