
var gstreamer = require("../");

gstreamer.start({
    url: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov?random=" + Math.random(),
    port: 80,
    quiet: false
});

