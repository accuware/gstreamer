### About
GStreamer 1.0 wrapper for very low latency streaming over websocket in order to provide IP camera feeds to the Accuware Dragonfly Demonstrator.

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
Then 
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


If you are unable to make this run, you can still let the Accuware Server obtain the video directly. For this specify your **public** RTSP stream address in the parameter line.

e.g.

```
https://dragonfly-demo.accuware.com/?video-url=rtsp://<your-IP-camera-url>
```

Please note: Your RTSP stream has to be publicly available on the Internet then. The latency will be a bit higher.

### TODO
- Secure to client
- Harden against connectivity loss




