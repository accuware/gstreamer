
var gstreamer = require(".")

gstreamer.start({
    url: "rtsp://192.168.188.30:554/onvif1",		    // e.g. a gst-rtsp-server camera feed on Ubuntu or a Raspberry Pi or even a surveillance cam
    quality: 85,
    quiet: false
})

// See index.js for more options
// After having launched with node server.js open your browser at localhost:port (port default 9000)