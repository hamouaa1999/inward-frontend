package com.inward0;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.Service;
import android.content.ComponentCallbacks2;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.graphics.ImageFormat;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureFailure;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.TotalCaptureResult;
import android.media.Image;
import android.media.ImageReader;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.view.Surface;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CameraService extends Service {

    private String byteString = "";
    private int images = 0;

    private CameraDevice mCamera;

    private ImageReader imageReader;

    private boolean capture;

    private NotificationManagerCompat notificationManager;

    private CameraCaptureSession cameraCaptureSession;

    private OpenCameraThread openCameraThread = new OpenCameraThread();
    private RepeatingRequestThread repeatingRequestThread = new RepeatingRequestThread();
    private CaptureSessionThread captureSessionThread = new CaptureSessionThread();

    private ImageHandlingThread imageHandlingThread = new ImageHandlingThread();

    private ImageBufferingThread imageBufferingThread = new ImageBufferingThread();

    private ImageBufferer imageBufferer = new ImageBufferer();

    private ScreenOffBroadcastReceiver mScreenStateReceiver = new ScreenOffBroadcastReceiver();

    private CaptureRequest.Builder captureRequestBuilder;

    // private AppDataBase db;

    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.i("--service yes--", Objects.requireNonNull(intent.getExtras().getString("userId")));
        //IntentFilter screenStateFilter = new IntentFilter();
        //screenStateFilter.addAction(Intent.ACTION_SCREEN_OFF);
        //screenStateFilter.addAction(Intent.ACTION_CAMERA_BUTTON);
        //registerReceiver(mScreenStateReceiver, screenStateFilter, Context.RECEIVER_NOT_EXPORTED);

        ApiPoster.setUserId(Objects.requireNonNull(intent.getExtras().getString("userId")));

        Notification notification = new NotificationCompat.Builder(this, "Camera Service Channel")
                .setContentTitle("Content Title")
                .setContentText("Content Text")
                .build();

        startForeground(1, notification);

        RecordFaces();

        return START_NOT_STICKY;
    }

    @SuppressLint("MissingPermission")
    private void RecordFaces() {
        openCameraThread.start();
        captureSessionThread.start();
        repeatingRequestThread.start();
        imageHandlingThread.start();
        imageBufferingThread.start();
        capture = true;
        CameraCaptureSession.CaptureCallback captureCallback = new CameraCaptureSession.CaptureCallback() {
            @Override
            public void onCaptureCompleted(CameraCaptureSession session, CaptureRequest request, TotalCaptureResult result) {
                Log.i("onCaptureCompleted", "onCaptureCompleted");
            }

            @Override
            public void onCaptureFailed(CameraCaptureSession session, CaptureRequest request, CaptureFailure failure) {
                Log.i("---onCaptureFailed---", "---onCaptureFailed--- " + failure.getReason());
            }
        };

        CameraCaptureSession.StateCallback cameraCaptureSessionStateCallback = new CameraCaptureSession.StateCallback() {
            @Override
            public void onConfigured(CameraCaptureSession session) {
                Log.i("onConfigured", "------onConfigured------");

                try {
                    cameraCaptureSession = session;
                    while (capture) {
                        Log.i("--capture--", "Capturing Image");
                        session.capture(captureRequestBuilder.build(), captureCallback, repeatingRequestThread.getHandler());
                        Thread.sleep(1000);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onConfigureFailed(CameraCaptureSession session) {
                Log.i("onConfiguredFailed", "----onConfiguredFailed----");
            }
        };

        CameraDevice.StateCallback stateCallback = new CameraDevice.StateCallback() {
            @Override
            public void onOpened(@NonNull CameraDevice camera) {
                mCamera = camera;
                try {
                    imageReader = ImageReader.newInstance(50, 50, ImageFormat.JPEG, 2);
                    imageReader.setOnImageAvailableListener(reader -> handleImage(reader), imageHandlingThread.getHandler());
                    Surface surface = imageReader.getSurface();
                    captureRequestBuilder = camera.createCaptureRequest(CameraDevice.TEMPLATE_RECORD);
                    captureRequestBuilder.addTarget(surface);
                    List<Surface> surfaceList = Collections.singletonList(surface);
                    camera.createCaptureSession(surfaceList, cameraCaptureSessionStateCallback, captureSessionThread.getHandler());
                } catch (Exception e) {
                    if (e.getMessage() != null) {
                        Log.i("--my error--", e.getMessage());
                    }
                }
            }

            @Override
            public void onDisconnected(@NonNull CameraDevice camera) {
                Log.i("onDisconnected", "onDisconnected");
                ImageBufferer.getImagePoster().makeApiCall();
                Intent intent = new Intent(getApplicationContext(), CameraService.class);
                getApplicationContext().stopService(intent);

                openCameraThread.interrupt();
                captureSessionThread.interrupt();
                repeatingRequestThread.interrupt();
                imageHandlingThread.interrupt();
                imageBufferingThread.interrupt();
                mCamera.close();
                imageReader.close();
                cameraCaptureSession.close();
                capture = false;

                notificationManager = NotificationManagerCompat.from(getApplicationContext());
                Notification notification = new NotificationCompat.Builder(getApplicationContext(), "Camera Service Channel")
                        .setSmallIcon(R.drawable.emotion_notification)
                        .setContentTitle("Notification")
                        .setContentText("This is the content of your notification")
                        .build();

                if (ActivityCompat.checkSelfPermission(getApplicationContext(), android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    // TODO: Consider calling
                    //    ActivityCompat#requestPermissions
                    // here to request the missing permissions, and then overriding
                    //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                    //                                          int[] grantResults)
                    // to handle the case where the user grants the permission. See the documentation
                    // for ActivityCompat#requestPermissions for more details.
                    return;
                }
                notificationManager.notify(2, notification);
            }

            @Override
            public void onError(@NonNull CameraDevice camera, int error) {
                Log.i("onError", "onError");
                camera.close();
            }
        };


        try {
            CameraManager manager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
            String cameraId = manager.getCameraIdList()[0];
            manager.openCamera(cameraId, stateCallback, openCameraThread.getHandler());
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }

    }

    @Override
    public void onDestroy() {
        Log.i("---error destroy---", "Destroyed");
        //unregisterReceiver(mScreenStateReceiver);
        openCameraThread.interrupt();
        captureSessionThread.interrupt();
        repeatingRequestThread.interrupt();
        imageHandlingThread.interrupt();
        imageBufferingThread.interrupt();
        mCamera.close();
        imageReader.close();
        cameraCaptureSession.close();
        capture = false;
        super.onDestroy();
    }



    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void handleImage(ImageReader reader) {

        try {

            imageBufferer.setImage(reader.acquireLatestImage());
            imageBufferingThread.getHandler().post(imageBufferer);
            Log.i("--image loaded--", "Image loaded");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

