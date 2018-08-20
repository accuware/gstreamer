### About
GStreamer 1.0 wrapper for very low latency streaming over websocket in order to provide IP camera feeds to the Accuware Dragonfly Demonstrator.

### Prerequesites Linux
```
sudo apt-get install gstreamer-tools
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

Run it 

```
node server.js
```

### Let Accuware Dragonfly Demonstrator know about the little helper
Provide the configured port as URL query parameter while opening the Accuware Demonstrator in your browser

```
https://dragonflay-demo.accuware.com/?rtsp-helper-port=9000
```
