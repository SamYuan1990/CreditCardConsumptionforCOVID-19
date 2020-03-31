package com.example.springboot.util;

import com.google.gson.Gson;

import java.io.*;
import java.net.MalformedURLException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
public class AIClient {


    /*
    * curl -k -X POST \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --header "Accept: application/json" \
    --data-urlencode "grant_type=urn:ibm:params:oauth:grant-type:apikey" \
    --data-urlencode "apikey=AZ5VvX71L-TKTgaZ5she_ItFKFfk5yo_8pkHm9k-FOCj" \
    "https://iam.bluemix.net/identity/token"
    * */


    private static String getToken() {
        String rs = "";
        try {
            Runtime run = Runtime.getRuntime();
            Process p = run.exec("./src/main/resources/requestToken.sh");
            int status = p.waitFor();
            if (status != 0) {
                System.out.println("Failed to call shell's command");
            }
            BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuffer strbr = new StringBuffer();
            String line;
            while ((line = br.readLine())!= null)
            {
                strbr.append(line).append("\n");
            }

            String result = strbr.toString();
            Gson gson = new Gson();
            Map<String,Object> object = gson.fromJson(result, Map.class);
            rs = object.get("access_token").toString();
        } catch (Exception e) {
            e.printStackTrace();
        }


        return rs;
        //return "eyJraWQiOiIyMDIwMDMyNjE4MjgiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJpYW0tU2VydmljZUlkLTlhMGQyOTk4LTlhM2YtNDdhMS05NzRkLTJkNjk3NjQ2NzdkNyIsImlkIjoiaWFtLVNlcnZpY2VJZC05YTBkMjk5OC05YTNmLTQ3YTEtOTc0ZC0yZDY5NzY0Njc3ZDciLCJyZWFsbWlkIjoiaWFtIiwiaWRlbnRpZmllciI6IlNlcnZpY2VJZC05YTBkMjk5OC05YTNmLTQ3YTEtOTc0ZC0yZDY5NzY0Njc3ZDciLCJuYW1lIjoid2RwLXdyaXRlciIsInN1YiI6IlNlcnZpY2VJZC05YTBkMjk5OC05YTNmLTQ3YTEtOTc0ZC0yZDY5NzY0Njc3ZDciLCJzdWJfdHlwZSI6IlNlcnZpY2VJZCIsImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6Ijg1ZDE3NTVkYjQ0MjQ0NzU5YTJiNDI3ZGJkODIwMjRkIn0sImlhdCI6MTU4NTY0NTI0MywiZXhwIjoxNTg1NjQ4ODQzLCJpc3MiOiJodHRwczovL2lhbS5ibHVlbWl4Lm5ldC9pZGVudGl0eSIsImdyYW50X3R5cGUiOiJ1cm46aWJtOnBhcmFtczpvYXV0aDpncmFudC10eXBlOmFwaWtleSIsInNjb3BlIjoiaWJtIG9wZW5pZCIsImNsaWVudF9pZCI6ImRlZmF1bHQiLCJhY3IiOjEsImFtciI6WyJwd2QiXX0.CzdiMCxNzg426vcdd83LWwuT7-Hm9bc2F9XT6yQoxNi9pXbWCVrfLq9C8-D3ORh7rs9QDCZAOV5u-EylFuMPwRHZqis3cs4u2ZcEFfF0BSHZ1BnFGgnG0cnuuPt6wrc-i5HIm29paLhu5momB64-q6kmbaoOUPq2xKJsiSKQ63VM8GZtuMmKpDoE1tBdj8FSXTxRFeDohosRocSwkrfXExxwMwI9qDMRJREx-eZN62qdz0qhsNK104b17wwNkxonmYleFsYWeMTI8U8H5WBSti4_u3RCO0J1Hn8nzGoy0MrGWuH4H7S3KB2_dWZZlcL16eAhP2hlWk2Gh6SRZ9TDaA";
    }

    public static String ReqsetTOAI(String Credit_card,String Cough,String Chest_pain,String Fever,String Shared) throws IOException {
        String rs = "";

        HttpURLConnection scoringConnection = null;
        BufferedReader scoringBuffer = null;
        try {
            String token=getToken();
            String wml_token = "Bearer "+token;

            String ml_instance_id = "cdd5831f-29e4-4cac-a2e1-cc219872b7b1";

            URL scoringUrl = new URL("https://us-south.ml.cloud.ibm.com/v4/deployments/605e12f6-5696-47ce-81fa-39b2331dea46/predictions");
            scoringConnection = (HttpURLConnection) scoringUrl.openConnection();
            scoringConnection.setDoInput(true);
            scoringConnection.setDoOutput(true);
            scoringConnection.setRequestMethod("POST");
            scoringConnection.setRequestProperty("Accept", "application/json");
            scoringConnection.setRequestProperty("Authorization", wml_token);
            scoringConnection.setUseCaches(false);
            scoringConnection.setRequestProperty("ML-Instance-ID", ml_instance_id);
            scoringConnection.setRequestProperty("Content-Type", "application/json");

            OutputStreamWriter writer = new OutputStreamWriter(scoringConnection.getOutputStream(), "UTF-8");
            String payload = "{\"input_data\": [{\"fields\": [\"Credit_Card\", \"Cough\", \"Chest_pain\", \"Fever\", \"Shared\", \"Confirmed\"], " +
                    "\"values\": [[\""+Credit_card+"\",\""+Cough+"\",\""+Chest_pain+"\","+Integer.valueOf(Fever)+",\""+Shared+"\",\"No\"]]}]}";
            writer.write(payload);
            writer.close();
            scoringBuffer = new BufferedReader(new InputStreamReader(scoringConnection.getInputStream()));
            StringBuffer jsonStringScoring = new StringBuffer();
            String lineScoring;
            while ((lineScoring = scoringBuffer.readLine()) != null) {
                jsonStringScoring.append(lineScoring);
            }
            //System.out.println(jsonStringScoring);
            rs = jsonStringScoring.toString();
            rs = rs.substring(rs.indexOf("values\": [[")+"values\": [[".length()+1);
            rs = rs.substring(0,rs.indexOf("\""));
            //System.out.println(rs);
        } catch (IOException e) {
            System.out.println("The URL is not valid.");
            System.out.println(e.getMessage());
        }
        finally {
            if (scoringConnection != null) {
                scoringConnection.disconnect();
            }
            if (scoringBuffer != null) {
                scoringBuffer.close();
            }
        }
        return rs;
    }
}