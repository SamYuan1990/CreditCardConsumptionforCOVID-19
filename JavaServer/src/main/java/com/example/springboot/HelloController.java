package com.example.springboot;

import com.example.springboot.dataModel.MarketInfo;
import com.example.springboot.util.utils;
import com.google.gson.Gson;
import org.hyperledger.fabric.sdk.Channel;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class HelloController {

	@RequestMapping("/")
	public String index() {
		initMarkets();
		System.out.println("Completed market");
		initHosptial();

		return "Greetings from Spring Boot!";
	}

	private Date yesterday(Date today) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(today);
		calendar.set(Calendar.DATE, calendar.get(Calendar.DATE) - 1);
		return calendar.getTime();
	}

	public static List<String> importCsv(File file) {
	   List<String> dataList = new ArrayList<String>();

	   BufferedReader br = null;
	   try {
		 br = new BufferedReader(new FileReader(file));
		 String line = "";
		 while ((line = br.readLine()) != null) {
		   dataList.add(line);
		 }
	   } catch (Exception e) {
	   } finally {
		 if (br != null) {
		   try {
			 br.close();
		   } catch (IOException e) {
			 e.printStackTrace();
		   }
		 }
   }

   return dataList;

	}

	private void initMarkets() {
		List<String> dataList=importCsv(new File("./src/main/resources/supermarket_sales.csv"));
		Date d =new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		if(dataList!=null && !dataList.isEmpty()){
			for(int i=0; i<dataList.size();i++ ){
				if(i!=0){//不读取第一行
					String s=dataList.get(i);
					String[] as = s.split(",");
					/*Invoice ID 0
						Branch 1
						City 2
						Date 10
						Time 11
						*/
					//Branch,City,ID,Date,Time
					initMarket(as[1].replace("A","M001").replace("B","M002").replace("C","M003"),"NYC",as[0],sdf.format(d),as[11]);
				}
			}
		}
	}

	private void initMarket(String market,String City, String credit_card, String d,String time){
		Channel mychannel = null;
		try {
			mychannel = utils.mychannelPool.borrowObject();
			utils.Invoke(mychannel,utils.MarketCC,"createTradeInfo",market,City,credit_card,d,time);
			utils.mychannelPool.returnObject(mychannel);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return;
	}

	private void initHosptial() {
		Date d0 = new Date();
		Date d1 = yesterday(d0);
		Date d2 = yesterday(d1);
		Date[] days = new Date[]{d0,d1,d2};
		String[] status = new String[]{utils.success,utils.warn,utils.danger};
		Random r = new Random();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		List<String> dataList=importCsv(new File("./src/main/resources/supermarket_sales.csv"));
		if(dataList!=null && !dataList.isEmpty()){
			for(int i=0; i<dataList.size();i++ ){
				if(i!=0){//不读取第一行
					String s=dataList.get(i);
					String[] as = s.split(",");
					/*Invoice ID 0
						Branch 1
						City 2
						Date 10
						Time 11
						*/
					//Branch,City,ID,Date,Time
					int day = r.nextInt(3);
					int j = r.nextInt(3);
					MyStatusConntroller.RecordToChain(as[0],"No","No","0",sdf.format(days[day]),status[j]);
					if(!as[1].equals("C")) {
						if(r.nextInt(11)>6) {
							NewConfirmConntroller.Confirmed(as[0], "Yes", "Yes", "3", sdf.format(days[day]), utils.danger);
						}
					}
				}
			}
		}
		return;
	}

}