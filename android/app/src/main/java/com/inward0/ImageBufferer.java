package com.inward0;

import android.media.Image;
import android.os.Build;
import android.os.Handler;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.Base64;
import java.util.concurrent.TimeUnit;
import java.util.zip.GZIPOutputStream;

import okhttp3.Call;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ImageBufferer implements Runnable {

    private int images = 0;
    private String byteString = "";

    private final ImagePosterThread imagePosterThread = new ImagePosterThread();
    private static final ImagePoster imagePoster = new ImagePoster();
    private Image image = null;

    public ImageBufferer() {
        imagePosterThread.start();
    }

    public static ImagePoster getImagePoster() {
        return imagePoster;
    }
    public void setImage(Image image) {
        this.image = image;
    }
    @Override
    public void run() {
        try {
            ByteBuffer buffer = image.getPlanes()[0].getBuffer();
            byte[] bytes = new byte[buffer.capacity()];
            buffer.get(bytes);
            image.close();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                imagePoster.setImage(Base64.getEncoder().encodeToString(bytes)); //Arrays.toString(bytes.clone())
            }
            bytes = null;
            imagePosterThread.getHandler().post(imagePoster);
            //postImageData(byteString);
            /*byteString += "|" + Arrays.toString(bytes);
            images++;
            Log.i("----image----", "Captured image: " + images);
            if (images > 50) {
                Log.i("---ngah ngah----", byteString);
                //ByteArrayOutputStream obj = compress(byteString);
                //String outStr = Base64.getEncoder().encodeToString(obj.toByteArray());
                //postImageData(outStr);
                images = 0;
                byteString = "";
            }*/
        } catch (Exception e) {
            e.printStackTrace();
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