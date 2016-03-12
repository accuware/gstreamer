### About
GStreamer wrapper for very low latency streaming over websocket.

Perfect for IP Camera in a browser, webview etc.

### Installation
```
sudo apt-get install gstreamer-tools
```
Then
```
npm install gstreamer
```

### Usage
```javascript
var gstreamer = require("../");

gstreamer.start({
    url: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov",
    //url: "rtsp://192.168.1.92:554//1",
    port: 80,
    quiet: false
});
```

Run the example, and browse to your http://IP to see the result
