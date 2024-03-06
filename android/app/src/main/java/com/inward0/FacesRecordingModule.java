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

    private static final int PERMISSION_REQUEST_CODE = 200;
    private static final int REQUEST_IMAGE_CAPTURE = 1;

    private String byteString = "";
    private int images = 0;

    private NotificationManagerCompat norificationManager;

    // private AppDataBase db;
    private CameraCaptureSession mSession = null;

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
    public void work(String userId) {
        Log.i("------ user id -------", userId);


    }

    @ReactMethod
    public void stopRecording() throws CameraAccessException {
        ImageBufferer.getImagePoster().makeApiCall();
        Log.i("--here hamou--", "DONE CORRECTLY BABE");
        Intent intent = new Intent(getReactApplicationContext(), CameraService.class);
        getReactApplicationContext().stopService(intent);
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void startRecording(String userId) {
        Log.i("--executed--", userId);
        /*WorkRequest recordFacesWorkRequest = new OneTimeWorkRequest.Builder(FacesRecordingWorker.class)
                .build();
        WorkManager
                .getInstance(getReactApplicationContext())
                .enqueue(recordFacesWorkRequest);*/

        Intent intent = new Intent(getReactApplicationContext(), CameraService.class);
        intent.putExtra("userId", userId);
        getReactApplicationContext().startService(intent);

    }


}