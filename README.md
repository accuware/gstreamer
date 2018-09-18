### About
GStreamer 1.0 proxy for very low latency streaming over websocket in order to provide IP camera feeds to the [`Accuware Dragonfly Demonstrator`](https://dragonfly-demo.accuware.com)  or a browser window.

### How it works?
This little node app works like a proxy between a H.264 RTSP video source and your browser, since browsers today are unable to consume H.264 directly. The app uses a GStreamer 1.0 pipleline in order to obtain the H.264 video from a source and converts it to Motion JPEG (MJPEG), which is then forwarded to the browser or any listening application via a `socket.io` websocket.

The generic equivalient with display is this

```
gst-launch-1.0 -v rtspsrc location=rtsp://<your-IP-camera-url>:554/onvif1 !  rtph264depay ! h264parse ! avdec_h264 ! videoconvert ! autovideosink sync=false
```

The app uses a slight modification which allows to re-stream the decoded frames via TCP 

```
gst-launch-1.0 -v rtspsrc location=rtsp://<your-IP-camera-url>:554/onvif1 !  rtph264depay ! h264parse ! avdec_h264 ! videoconvert ! jpegenc quality=75 ! tcpclientsink host=127.0.0.1 port=9001
```

The app uses the configured `port + 1` for this. You can view the video in your browser then via `localhost:port`


### Prerequesites IP-Cam
Obtain the RTSP URL, e.g. `rtsp://IP-of-your-IP-camera:554/onvif1` for most of `SriCam` (http://www.sricam.com/)

### Prerequesites Ubuntu 16.04 LTS
```
sudo apt-get install gstreamer1.0-libav gstreamer1.0-plugins-ugly gstreamer1.0-plugins-base gstreamer1.0-plugins-bad gstreamer1.0-plugins-good gstreamer1.0-tools
```

After installation check for availability of `avdec_h264` 
```
gst-inspect-1.0 avdec_h264
```

If it cannot be found, please download the source of gst-libav from here https://gstreamer.freedesktop.org/src/gst-libav/. Take care, that you download the sources matching the version of your apt installation (at time of writing 1.8.3).

Unpack the source code, change into the directory and...

```
./configure
make
sudo make install
```



### Prerequisites macOS
Install latest packages from here https://gstreamer.freedesktop.org/data/pkg/osx/1.14.2/


### Clone this repo
```
git clone https://github.com/accuware/gstreamer.git
cd gstreamer
```
then 
```
npm install
```

### Edit `server.js` 
```javascript
var gstreamer = require(".");

gstreamer.start({
    url: "rtsp://<your-IP-camera-url>",
    port: 9000,
    quiet: false
});
```

See `index.js` for more options.

### Run it 

```
node server.js
```

### Open your browser to check the video

http://localhost:9000


### Let Accuware Dragonfly Demonstrator know about the little helper
Provide the configured helper endpoint as query parameter while opening the Accuware Demonstrator in your browser

```
https://dragonfly-demo.accuware.com/?video-url=http://localhost:9000
```

> Note: Since this ends up in a mix of secure and insecure content, there is currently only `Chrome`, which supports this for whatever reasons, since it is a tiny security issue. 

`Firefox` needs to be conviced via 
```
about:config
security.mixed_content.block_active_content = false
```

`Edge` behaviour is unknown and I could not find any way to make `Safari` establishing a connection to `localhost` while being loaded from a secured server.

By setting the options

```
    key: 'localhost.key.pem',
    cert: 'localhost.crt'
```

you enable the proxy to provide a "secured" channel by using a self signed certificate, which obsoletes the a.m. "mixed content" problem.

> Note: You need to make your browser accept this self signed certificate by adding the `ca.pem` file to the trusted root CA authorities. You can do this by either importing the root CA certificate into the OS key store or use the browser mechanisms to do that. Details here https://fabianlee.org/2018/02/17/ubuntu-creating-a-trusted-ca-and-san-certificate-using-openssl-on-ubuntu/ section "Browser Evaluation"

Find the stream at

```
https://localhost:9000
```

### Use together with Accuware Dragonfly Demonstrator

```
https://dragonfly-demo.accuware.com/?video-url=https://localhost:9000
```


If you are unable to make this run, you can still let the Accuware Server obtain the video directly. For this specify your **public** RTSP stream address in the parameter line.

e.g.

```
https://dragonfly-demo.accuware.com/?video-url=rtsp://<your-IP-camera-url>
```

Please note: Your RTSP stream has to be publicly available on the Internet then. The latency will be a bit higher.

### Todos

- Harden against connectivity loss




