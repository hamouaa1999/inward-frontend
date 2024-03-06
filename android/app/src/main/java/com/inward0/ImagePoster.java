package com.inward0;

import android.util.Log;

import java.io.IOException;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

public class ImagePoster implements Runnable {

    private String image = "";
    private int images = 0;


    private ApiPoster apiPoster;
    private PosterThread posterThread;

    public ImagePoster() {
        posterThread = new PosterThread();
        posterThread.start();

    }


    public void setImage(String image) {
        this.image +=  image + "|";
        this.images++;
    }
    @Override
    public void run() {

        Log.i("--Image Poster Thread--", "Message Thread: " + images);

        if (images > 30) {
            makeApiCall();
        }


    }

    public void makeApiCall() {
        posterThread.getHandler().post(new ApiPoster(this.image, posterThread.getHttpClient()));
        Log.i("--Worked fine", "Worked fine");
        images = 0;
        image = null;
        image = new String("");
    }
}
