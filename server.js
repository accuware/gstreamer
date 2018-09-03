
var gstreamer = require(".")

gstreamer.start({
//    url: "rtsp://192.168.188.36:8554/test",		                // Raspberry Pi runnint gst-rtsp-server
    url: "rtsp://192.168.188.30:554/onvif1",		                // SriCam
//  url: 'rtsp://184.72.239.149/vod/mp4:bigbuckbunny_1500.mp4',     // Movie
    quality: 75,
    quiet: false,
    key: 'selfsign.key',
    cert: 'selfsign.crt'
})

// See index.js for more options
// After having launched with node server.js open your browser at localhost:port (port default 9000)