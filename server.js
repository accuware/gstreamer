
var gstreamer = require(".")

gstreamer.start({
//    url: "rtsp://192.168.188.99:8554/test",		                                // e.g. an gst-rtsp camera feed on Ubuntu
    url: "rtsp://192.168.188.83",		                                // e.g. an gst-rtsp camera feed on Ubuntu
    port: 8000,
    quality: 75,
    quiet: false
})

