package com.example.springboot;

import com.example.springboot.util.utils;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

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
			initMarket("M001","C0001",date);
			initMarket("M001","C0002",date);
			initMarket("M003","C0002",date);
			initMarket("M001","C0003",date);
			initMarket("M001","C0004",date);
			initMarket("M003","C0004",date);
			initMarket("M001","C0005",date);
			initMarket("M001","C0006",date);
			initMarket("M001","C0007",date);
			initMarket("M003","C0007",date);
			initMarket("M001","C0008",date);
			initMarket("M002","C0009",date);
			initMarket("M004","C0009",date);
			initMarket("M002","C0010",date);
			initMarket("M002","C0011",date);
			initMarket("M004","C0011",date);
			initMarket("M002","C0012",date);
			initMarket("M004","C0012",date);
			initMarket("M002","C0013",date);
			initMarket("M002","C0014",date);
			initMarket("M004","C0014",date);
			initMarket("M002","C0015",date);
			initMarket("M002","C0016",date);
			initMarket("M004","C0016",date);
			initMarket("M003","C0017",date);
			initMarket("M001","C0018",date);
			initMarket("M003","C0018",date);
			initMarket("M003","C0019",date);
			initMarket("M001","C0020",date);
			initMarket("M003","C0020",date);
			initMarket("M003","C0021",date);
			initMarket("M003","C0022",date);
			initMarket("M003","C0023",date);
			initMarket("M001","C0024",date);
			initMarket("M003","C0024",date);
			initMarket("M004","C0025",date);
			initMarket("M002","C0026",date);
			initMarket("M004","C0026",date);
			initMarket("M004","C0027",date);
			initMarket("M004","C0028",date);
			initMarket("M004","C0029",date);
			initMarket("M002","C0030",date);
			initMarket("M004","C0030",date);
			initMarket("M004","C0031",date);
			initMarket("M004","C0032",date);
			System.out.println("Completed for "+date);
			d1=yesterday(d1);
		}
	}

	private void initMarket(String market, String credit_card, String d){
		utils.Invoke(utils.MarketCC,"createTradeInfo",market,credit_card,d);
		return;
	}

	private void initHosptial() {
		return;
	}

}