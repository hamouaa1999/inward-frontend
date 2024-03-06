package com.inward0;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class ScreenOffBroadcastReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i("--screen--", "Screen turned off");
        String action = intent.getAction();
        if (action != null && action.equals(Intent.ACTION_CAMERA_BUTTON)) {
            Log.i("--CAMERA--", "CAMERA HARDWARE BEING USED");
        } else if (action != null && action.equals(Intent.ACTION_SCREEN_OFF)) {
            Intent broadcastReceiverIntent = new Intent(context, CameraService.class);
            context.stopService(broadcastReceiverIntent);
        }
    }
}
