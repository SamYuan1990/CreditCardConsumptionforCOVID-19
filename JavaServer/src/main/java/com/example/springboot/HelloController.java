package com.example.springboot;

import com.example.springboot.util.utils;
import com.google.gson.Gson;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

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

	private void initMarkets() {
		Date d1 = new Date();
		for(int i=0;i<14;i++) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			String date=sdf.format(d1);
			initMarket("M0001","C0001",date);
			initMarket("M0001","C0002",date);
			initMarket("M0003","C0002",date);
			initMarket("M0001","C0003",date);
			initMarket("M0001","C0004",date);
			initMarket("M0003","C0004",date);
			initMarket("M0001","C0005",date);
			initMarket("M0001","C0006",date);
			initMarket("M0001","C0007",date);
			initMarket("M0003","C0007",date);
			initMarket("M0001","C0008",date);
			initMarket("M0002","C0009",date);
			initMarket("M0004","C0009",date);
			initMarket("M0002","C0010",date);
			initMarket("M0002","C0011",date);
			initMarket("M0004","C0011",date);
			initMarket("M0002","C0012",date);
			initMarket("M0004","C0012",date);
			initMarket("M0002","C0013",date);
			initMarket("M0002","C0014",date);
			initMarket("M0004","C0014",date);
			initMarket("M0002","C0015",date);
			initMarket("M0002","C0016",date);
			initMarket("M0004","C0016",date);
			initMarket("M0003","C0017",date);
			initMarket("M0001","C0018",date);
			initMarket("M0003","C0018",date);
			initMarket("M0003","C0019",date);
			initMarket("M0001","C0020",date);
			initMarket("M0003","C0020",date);
			initMarket("M0003","C0021",date);
			initMarket("M0003","C0022",date);
			initMarket("M0003","C0023",date);
			initMarket("M0001","C0024",date);
			initMarket("M0003","C0024",date);
			initMarket("M0004","C0025",date);
			initMarket("M0002","C0026",date);
			initMarket("M0004","C0026",date);
			initMarket("M0004","C0027",date);
			initMarket("M0004","C0028",date);
			initMarket("M0004","C0029",date);
			initMarket("M0002","C0030",date);
			initMarket("M0004","C0030",date);
			initMarket("M0004","C0031",date);
			initMarket("M0004","C0032",date);
			System.out.println("Completed for "+date);
			d1=yesterday(d1);
		}
	}

	private void initMarket(String market, String credit_card, String d){
		utils.Invoke(utils.MarketCC,"createTradeInfo",market,credit_card,d);
		return;
	}

	private void initHosptial() {
		Date d1 = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String date=sdf.format(d1);
		RecordToChain("C0001","YES","YES","5",date,utils.danger);
		RecordToChain("C0002","NO","YES","5",date,utils.danger);
		RecordToChain("C0003","YES","NO","5",date,utils.danger);
		RecordToChain("C0004","NO","NO","5",date,utils.warn);
		RecordToChain("C0005","YES","YES","0",date,utils.danger);
		RecordToChain("C0006","NO","YES","0",date,utils.warn);
		RecordToChain("C0007","YES","NO","0",date,utils.warn);
		RecordToChain("C0008","NO","NO","0",date,utils.warn);
		RecordToChain("C0009","YES","YES","5",date,utils.danger);
		RecordToChain("C0010","NO","YES","5",date,utils.warn);
		RecordToChain("C0011","YES","NO","5",date,utils.warn);
		RecordToChain("C0012","NO","NO","5",date,utils.warn);
		RecordToChain("C0013","YES","YES","0",date,utils.danger);
		RecordToChain("C0014","NO","YES","0",date,utils.warn);
		RecordToChain("C0015","YES","NO","0",date,utils.warn);
		RecordToChain("C0016","NO","NO","0",date,utils.success);
		Confirmed("C0001","YES","YES","5",date,utils.danger);
		Confirmed("C0002","NO","YES","5",date,utils.danger);
		d1=yesterday(d1);
		date=sdf.format(d1);
		RecordToChain("C0017","YES","YES","5",date,utils.danger);
		RecordToChain("C0018","NO","YES","5",date,utils.danger);
		RecordToChain("C0019","YES","NO","5",date,utils.danger);
		RecordToChain("C0020","NO","NO","5",date,utils.warn);
		RecordToChain("C0021","YES","YES","0",date,utils.danger);
		RecordToChain("C0022","NO","YES","0",date,utils.warn);
		RecordToChain("C0023","YES","NO","0",date,utils.warn);
		RecordToChain("C0024","NO","NO","0",date,utils.warn);
		RecordToChain("C0025","YES","YES","5",date,utils.danger);
		RecordToChain("C0026","NO","YES","5",date,utils.warn);
		RecordToChain("C0027","YES","NO","5",date,utils.warn);
		RecordToChain("C0028","NO","NO","5",date,utils.warn);
		RecordToChain("C0029","YES","YES","0",date,utils.warn);
		RecordToChain("C0030","NO","YES","0",date,utils.warn);
		RecordToChain("C0031","YES","NO","0",date,utils.warn);
		RecordToChain("C0032","NO","NO","0",date,utils.success);
		Confirmed("C0017","YES","YES","5",date,utils.danger);
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
		System.out.println(curentLocations);
		Gson gson = new Gson();
		String[] currentobject = gson.fromJson(curentLocations, String[].class);
		String[] Recentobject = gson.fromJson(RecentLocations,String[].class);
		Set<String> set = new TreeSet<String>();
		if(currentobject!=null) {
			for (String s : currentobject) {
				if (s != null) {
					System.out.println("add 2:" + s);
					set.add(s);
				}
			}
		}
		if(Recentobject!=null) {
			for (String s : Recentobject) {
				if (s != null) {
					System.out.println("add:" + s);
					set.add(s);
				}
			}
		}
		String[] mergeRS = new String[set.size()];
		for(String s:set){
			System.out.println("Get:"+s);
			mergeRS[mergeRS.length-1] = s;
		}
		System.out.println("recent Market for "+credit_Card + " is "+RecentLocations);
		System.out.println(gson.toJson(mergeRS));
		utils.Invoke(utils.HospitalCC,"UpdateLocation",gson.toJson(mergeRS));
	}

}