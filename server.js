
var gstreamer = require(".")

gstreamer.start({
    url: "rtsp://192.168.188.99:8554/test",		                                // e.g. an gst-rtsp camera feed on Ubuntu
    port: 9000,
    quality: 85,
    quiet: false
})

