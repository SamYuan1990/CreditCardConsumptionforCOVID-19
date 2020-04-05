package com.example.springboot;

import com.example.springboot.util.utils;
import com.google.gson.Gson;
import org.hyperledger.fabric.sdk.Channel;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
public class HighRiskController {

	@RequestMapping("/highrisk")
	public Object index() {
		Channel mychannel = null;
		try {
			mychannel = utils.mychannelPool.borrowObject();


			String payload = utils.Query(mychannel,utils.HospitalCC,"queryByStatus",utils.danger);
			Gson gson = new Gson();
			String[] object = gson.fromJson(payload, String[].class);
			utils.mychannelPool.returnObject(mychannel);

			return payload;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}