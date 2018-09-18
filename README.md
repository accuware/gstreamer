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

### Prerequesites Linux
```
sudo apt-get install gstreamer1.0-tools
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
    key: 'selfsign.key',
    cert: 'selfsign.crt'
```

you enable the proxy to provide a "secured" channel by using a self signed certificate, which obsoletes the a.m. "mixed content" problem.

> Note: You need to make your browser accept this self signed certificate by open `https://localhost:9000` in your browser and establish the browser specific exceptions, before you are able to pass this to the Dragonfly Demonstrator. By this you should see the video of the source in the browser window.

```
https://dragonfly-demo.accuware.com/?video-url=https://localhost:9000
```


You are free to use the provided certifcate but you can also roll your own or provide a real certificate.

### Create self signed certifcate
```
openssl genrsa -out selfsign.key 2048 && openssl req -new -x509 -key selfsign.key -out selfsign.crt -sha256
```

will produce the two files `selfsign.key` and `selfsign.crt`, which you have to provide to the configuration.

### Verfiy certifcate
```
openssl x509 -in selfsign.crt -text -noout
openssl rsa -in selfsign.key -check
````


If you are unable to make this run, you can still let the Accuware Server obtain the video directly. For this specify your **public** RTSP stream address in the parameter line.

e.g.

```
https://dragonfly-demo.accuware.com/?video-url=rtsp://<your-IP-camera-url>
```

Please note: Your RTSP stream has to be publicly available on the Internet then. The latency will be a bit higher.

### Todos

- Harden against connectivity loss




