package com.inward0;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.util.Log;

import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class FacesRecordingModule extends ReactContextBaseJavaModule {

    FacesRecordingModule(ReactApplicationContext context) {
        super(context);
        // this.db = Room.databaseBuilder(getReactApplicationContext(),
        // AppDataBase.class, "database-name").build();
    }

    @Override
    public String getName() {
        return "FacesRecordingModule";
    }

    @ReactMethod
    public void stopRecording() throws CameraAccessException {
        ImageBufferer.getImagePoster().makeApiCall();
        Intent intent = new Intent(getReactApplicationContext(), CameraService.class);
        getReactApplicationContext().stopService(intent);
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void startRecording(String userId) {
        Intent intent = new Intent(getReactApplicationContext(), CameraService.class);
        intent.putExtra("userId", userId);
        getReactApplicationContext().startService(intent);

    }
}