package com.inward0;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;

public class ImageBufferingThread extends Thread {

    private Handler handler;
    @Override
    public void run() {
        Looper.prepare();
        handler = new Handler();
        Log.i("--Thread created--", "Image Handling Thread");
        Looper.loop();
    }

    public Handler getHandler() {
        return handler;
    }
}

