package com.example.springboot.util;
import java.nio.file.Paths;

import com.google.protobuf.ByteString;
import org.apache.commons.codec.binary.Hex;
import org.hyperledger.fabric.sdk.NetworkConfig;
import org.hyperledger.fabric.sdk.*;
import org.hyperledger.fabric.sdk.security.CryptoSuite;
import java.io.BufferedWriter;
import java.util.Collection;
import java.io.File;
import java.io.FileWriter;
import java.util.ArrayList;

import static java.lang.String.format;

public class utils {

    public static String config_network_path = "./src/main/resources/Networkconfig.json";
    public static String config_user_path = "./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore";
	public static String success = "success";
	public static String warn = "warning";
	public static String danger = "danger";
	public static String HospitalCC ="HospitalCC";
	public static String MarketCC="MarketCC";
	public static HFClient hfclient = HFClient.createNewInstance();
 	public static User appuser = null;
	public static Channel mychannel = null;



	public static ArrayList<ByteString> x509Header = new ArrayList<ByteString>();

    public static File findFileSk(File directory) {

        File[] matches = directory.listFiles((dir, name) -> name.endsWith("_sk"));

        if (null == matches) {
            throw new RuntimeException(format("Matches returned null does %s directory exist?", directory.getAbsoluteFile().getName()));
        }

        if (matches.length != 1) {
            throw new RuntimeException(format("Expected in %s only 1 sk file but found %d", directory.getAbsoluteFile().getName(), matches.length));
        }

        return matches[0];

    }

    public static NetworkConfig loadConfig(String config_network_path) {
        try {
            return NetworkConfig.fromJsonFile(new File(config_network_path));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

	public static void InitUser(){
    	try {
			CryptoSuite cryptoSuite = CryptoSuite.Factory.getCryptoSuite();
			hfclient.setCryptoSuite(cryptoSuite);
			File tempFile = File.createTempFile("teststore", "properties");
			tempFile.deleteOnExit();

			File sampleStoreFile = new File(System.getProperty("user.home") + "/test.properties");
			if (sampleStoreFile.exists()) { //For testing start fresh
				sampleStoreFile.delete();
			}
			final SampleStore sampleStore = new SampleStore(sampleStoreFile);
			appuser = sampleStore.getMember("peer1", "Org1", "Org1MSP",
					new File(String.valueOf(utils.findFileSk(Paths.get(utils.config_user_path).toFile()))),
					new File("./crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem"));

		}catch (Exception e){
    		System.out.println(e.toString());
		}
	}

    public static void Init(){
		try {
		NetworkConfig networkConfig = utils.loadConfig(utils.config_network_path);

		hfclient.setUserContext(appuser);
		hfclient.loadChannelFromConfig("mychannel", networkConfig);
		System.out.println(networkConfig.getPeerNames());
		mychannel = hfclient.getChannel("mychannel");
		mychannel.initialize();
		} catch (Exception e) {
			System.out.println(e.toString());
		}
	}

    public static String Invoke(String chaincodeName,String fcn,String... arguments) {
		String payload="";
		try {
			ChaincodeID chaincodeID = ChaincodeID.newBuilder().setName(chaincodeName)
					.setVersion("1.0")
					.build();
			TransactionProposalRequest transactionProposalRequest = hfclient.newTransactionProposalRequest();
			transactionProposalRequest.setChaincodeID(chaincodeID);
			transactionProposalRequest.setFcn(fcn);
			transactionProposalRequest.setArgs(arguments);
			transactionProposalRequest.setProposalWaitTime(500);
			transactionProposalRequest.setUserContext(appuser);

			Collection<ProposalResponse> invokePropResp = mychannel.sendTransactionProposal(transactionProposalRequest);
			for (ProposalResponse response : invokePropResp) {
				if (response.getStatus() == ChaincodeResponse.Status.SUCCESS) {
					//System.out.printf("Successful transaction proposal response Txid: %s from peer %s\n", response.getTransactionID(), response.getPeer().getName());
					//System.out.println("response :"+response);
					//System.out.println("response msg :"+response.getMessage());
					payload = response.getProposalResponse().getResponse().getPayload().toStringUtf8();
					//System.out.println(payload);
				}
			}

			mychannel.sendTransaction(invokePropResp);

		} catch (Exception e) {
			System.out.printf(e.toString());
		}

		return payload;
	}
}
