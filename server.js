
var gstreamer = require(".")


//
// Note:
// After having launched this script with node server.js open your browser at http(s)://localhost:port (port default 9000)
// The video is obtained as H.264 from the given `url` converted to MJPEG and re-streamed internally via sockets over port+1 (or tcpport if configured)
// From there a listening application at http(s)://localhost:9000 (or the configured host and port) is fed with the JPEG image stream to be displayed.
// Non-secure approach is configured by commenting 'key' and 'cert'. Don't forget to import the root CA certificate ca.pem into your browser.
// See README.md for details.
//
// See index.js for more options.
//


gstreamer.start({
    url: "rtsp://192.168.188.36:8554/test",		                // Raspberry Pi running gst-rtsp-server
//    url: "rtsp://192.168.188.30:554/onvif1",		                // SriCam
//    url: 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov',     // Movie
    quality: 75,
    quiet: false,
    key: 'localhost.key.pem',
    cert: 'localhost.crt'
})
