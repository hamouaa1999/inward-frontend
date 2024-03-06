package com.inward0;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

public class OpenCameraThread extends Thread {

    private Handler handler;

    public Handler getHandler() {
        return handler;
    }
    @Override
    public void run() {
        Looper.prepare();
        handler = new Handler();
        Log.i("--Thread created--", "Open Camera Thread");
        Looper.loop();
    }

}