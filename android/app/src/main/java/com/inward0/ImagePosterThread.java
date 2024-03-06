package com.inward0;

import android.os.Handler;
import android.os.Looper;

public class ImagePosterThread extends Thread {

    private Handler handler;

    public Handler getHandler() {
        return handler;
    }
    @Override
    public void run() {
        Looper.prepare();
        this.handler = new Handler();
        Looper.loop();
    }
}