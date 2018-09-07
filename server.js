
var gstreamer = require(".")


//
// Note:
// After having launched this script with node server.js open your browser at http(s)://localhost:port (port default 9000)
// The video is obtained as H.264 from the given `url` converted to MJPEG and re-streamed internally via sockets over port+1 (or tcpport if configured)
// From there a listening application at http(s)://localhost:9000 (or the configured host and port) is fed with the JPEG image stream to be displayed.
// Non-secure approach is configured by commenting 'key' and 'cert'.
//
// See index.js for more options.
//


gstreamer.start({
//    url: "rtsp://192.168.188.36:8554/test",		                // Raspberry Pi running gst-rtsp-server
//    url: "rtsp://192.168.188.30:554/onvif1",		                // SriCam
    url: 'rtsp://184.72.239.149/vod/mp4:bigbuckbunny_1500.mp4',     // Movie
    quality: 75,
    quiet: false,
    key: 'selfsigned.key',
    cert: 'selfsigned.crt'
})
