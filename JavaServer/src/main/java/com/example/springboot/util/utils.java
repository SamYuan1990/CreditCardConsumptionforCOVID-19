package com.example.springboot.util;
import java.nio.file.Paths;

import com.google.protobuf.ByteString;
import org.apache.commons.codec.binary.Hex;
import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.ObjectPool;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
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
	public static String success = "success";//Success
	public static String warn = "warning";//Warning
	public static String danger = "danger";//Danger
	public static String HospitalCC ="HospitalCC";
	public static String MarketCC="MarketCC";
	public static HFClient hfclient = HFClient.createNewInstance();
 	public static User appuser = null;
	//public static Channel mychannel = null;
	public static GenericObjectPoolConfig myGenericObjectPoolConfig = new GenericObjectPoolConfig<>();
	public static ObjectPool<Channel> mychannelPool = new GenericObjectPool<Channel>(new MyChannelBuilderFactory(),myGenericObjectPoolConfig);

	public static void Init() {
		myGenericObjectPoolConfig.setTestOnBorrow(true);
	}

	private static class MyChannelBuilderFactory  extends BasePooledObjectFactory<Channel> {
		@Override
		public Channel create() throws Exception {
			Channel mychannel = null;
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
				NetworkConfig networkConfig = utils.loadConfig(utils.config_network_path);

				hfclient.setUserContext(appuser);
				hfclient.loadChannelFromConfig("mychannel", networkConfig);
				System.out.println(networkConfig.getPeerNames());
				mychannel = hfclient.getChannel("mychannel");
				mychannel.initialize();
			} catch (Exception e) {
				System.out.println(e.toString());
			}
			return mychannel;
		}

		@Override
		public PooledObject<Channel> wrap(Channel obj) {
			// 将对象包装成池对象
			return new DefaultPooledObject<>(obj);
		}
		// ③ 反初始化每次回收的时候都会执行这个方法
		@Override
		public void passivateObject(PooledObject<Channel> pooledObject) {

		}

		@Override
		public boolean validateObject(final PooledObject<Channel> pooledObject) {
			Channel pooledObj = pooledObject.getObject();
			return pooledObj.isInitialized() & !pooledObj.isShutdown();
		}

	}


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

    public static String Invoke(Channel mychannel,String chaincodeName,String fcn,String... arguments) {
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

	public static String Query(Channel mychannel,String chaincodeName,String fcn,String... arguments) {
		String payload="";
		try {
			ChaincodeID chaincodeID = ChaincodeID.newBuilder().setName(chaincodeName)
					.setVersion("1.0")
					.build();

			/*
			* QueryByChaincodeRequest queryByChaincodeRequest = client.newQueryProposalRequest();
                    queryByChaincodeRequest.setArgs("b");
                    queryByChaincodeRequest.setFcn("query");
                    queryByChaincodeRequest.setChaincodeID(chaincodeID);

                    Map<String, byte[]> tm2 = new HashMap<>();
                    tm2.put("HyperLedgerFabric", "QueryByChaincodeRequest:JavaSDK".getBytes(UTF_8));
                    tm2.put("method", "QueryByChaincodeRequest".getBytes(UTF_8));
                    queryByChaincodeRequest.setTransientMap(tm2);

                    // Try each peer in turn just to confirm the request object can be reused
                    for (Peer peer : channel.getPeers()) {
                        Collection<ProposalResponse> queryProposals = channel.queryByChaincode(queryByChaincodeRequest
			* */
			QueryByChaincodeRequest transactionProposalRequest = hfclient.newQueryProposalRequest();
			transactionProposalRequest.setChaincodeID(chaincodeID);
			transactionProposalRequest.setFcn(fcn);
			transactionProposalRequest.setArgs(arguments);
			transactionProposalRequest.setProposalWaitTime(500);
			transactionProposalRequest.setUserContext(appuser);

			Collection<ProposalResponse> queryPropResp = mychannel.queryByChaincode(transactionProposalRequest);
			for(ProposalResponse response:queryPropResp) {
				if (response.getStatus() == ChaincodeResponse.Status.SUCCESS) {
					//System.out.printf("Successful transaction proposal response Txid: %s from peer %s\n", response.getTransactionID(), response.getPeer().getName());
					//System.out.println("response :"+response);
					//System.out.println("response msg :"+response.getMessage());
					payload = response.getProposalResponse().getResponse().getPayload().toStringUtf8();
					//System.out.println(payload);
				}
			}
			//mychannel.queryByChaincode(queryPropResp);
		} catch (Exception e) {
			System.out.printf(e.toString());
		}

		return payload;
	}
}
