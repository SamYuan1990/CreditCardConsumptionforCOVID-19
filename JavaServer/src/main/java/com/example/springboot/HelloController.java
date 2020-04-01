package com.example.springboot;

import com.example.springboot.dataModel.MarketInfo;
import com.example.springboot.util.utils;
import com.google.gson.Gson;
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
		utils.Invoke(utils.MarketCC,"createTradeInfo",market,City,credit_card,d,time);
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
					RecordToChain(as[0],"No","No","0",sdf.format(days[day]),status[j]);
					if(!as[1].equals("C")) {
						if(r.nextInt(11)>6) {
							Confirmed(as[0], "Yes", "Yes", "3", sdf.format(days[day]), utils.danger);
						}
					}
				}
			}
		}
		return;
	}


	private void RecordToChain(String credit_card, String cough, String chest_pain, String fever,String date, String status) {
		utils.Invoke(utils.HospitalCC,"createPatientInfo",credit_card,cough,chest_pain,fever,date,status);
	}
	//credit_card,cough,chest_pain,fever,date,status
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