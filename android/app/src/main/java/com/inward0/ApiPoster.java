package com.inward0;

import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Calendar;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ApiPoster implements Runnable {

    private String image;

    private OkHttpClient client;

    public static String userId;

    public ApiPoster(String image, OkHttpClient client) {
        this.image = image;
        this.client = client;
    }

    public static void setUserId(String userId) {
        ApiPoster.userId = userId;
    }

    @Override
    public void run() {

        Calendar calendar = Calendar.getInstance();

        int currentHour = calendar.get(Calendar.HOUR_OF_DAY);
        int currentMinute = calendar.get(Calendar.MINUTE);
        int day = calendar.get(Calendar.DAY_OF_MONTH + 1);
        int month = calendar.get(Calendar.MONTH);
        int year = calendar.get(Calendar.YEAR);

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("images", this.image);
            jsonObject.put("userId", userId);
            jsonObject.put("hour", currentHour);
            jsonObject.put("minute", currentMinute);
            jsonObject.put("day", day);
            jsonObject.put("month", month);
            jsonObject.put("year", year);
        } catch (JSONException e) {
            e.printStackTrace();
        }


        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        // put your json here
        RequestBody body = RequestBody.create(JSON, jsonObject.toString());

        Request request = new Request.Builder()
                .url("http://10.0.2.2:5000/api/post-images") // /api/post
                .post(body)
                .build();


        try {
            Response response = client.newCall(request).execute();
        } catch (IOException e) {
            e.printStackTrace();
        }

        Log.i("--here--", "North America Babe");
    }
}
