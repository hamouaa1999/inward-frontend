package com.inward0;

import android.os.Handler;
import android.os.Looper;


import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.RequestBody;

public class PosterThread extends Thread {


    private Handler handler;

    private OkHttpClient client;

    public PosterThread() {
        OkHttpClient.Builder builder = new OkHttpClient.Builder();
        builder.connectTimeout(30, TimeUnit.SECONDS);
        builder.readTimeout(30, TimeUnit.SECONDS);
        builder.writeTimeout(30, TimeUnit.SECONDS);
        builder.callTimeout(30, TimeUnit.SECONDS);
        this.client = builder.build();
    }

    public Handler getHandler() {
        return handler;
    }


    @Override
    public void run() {
        Looper.prepare();
        handler = new Handler();
        Looper.loop();

    }

    public OkHttpClient getHttpClient() {
        return client;
    }
}
