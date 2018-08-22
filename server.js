
var gstreamer = require(".")

gstreamer.start({
    url: "rtsp://192.168.188.71:8554/test",		                                // e.g. a gst-rtsp-server camera feed on Ubuntu or a Raspberry Pi or even a surveillance cam
    quality: 75,
    quiet: false
})

// See index.js for more options