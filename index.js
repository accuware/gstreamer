module.exports = new gstreamer();

function gstreamer() {
    this.cp = require("child_process");
    this.fs = require("fs");
    this.net = require("net");
    this.http = require("http");
    this.sio = require("socket.io");
}

gstreamer.prototype._args = function () {
    return [
        "rtspsrc", "location=\"" + this.url + "\"",
        "latency=0",
        "is-live=true",         //probably outdated, but can't hurt
        "low-latency=true",     //probably outdated, but can't hurt
        "!", "decodebin",
        "!", "jpegenc", "quality=" + this.quality,
        "!", "tcpclientsink", "host=127.0.0.1", "port=" + this.tcpport
    ];
};

gstreamer.prototype.start = function (options) {
    options = options || {};

    this.quiet = options.quiet || false
    this.cmd = options.cmd || "gst-launch-1.0"                  // Linux, for macOS use 
    this.url = options.url || "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov"
    this.host = options.host || undefined
    this.port = options.port || 8000
    this.suffix = options.suffix || "/cam0"
    this.quality = options.quality || 85
    this.tcpport = options.tcpport || options.port + 1         // internal socket for listening on incoming video frames   

    let self = this
    let args = this._args()
    
    this.server = this.http.createServer()

    let io = self.sio.listen(self.server, {origins: '*:*'})
    let cam0 = io.of(self.suffix)
   

    self.tcp = self.net.createServer((socket) => {
        socket.on("data", (data) => {
           cam0.emit("data", data)
        })
    }).on("listening", () => {
        self.gst = self.cp.spawn(self.cmd, args)
        self.gst.stderr.pipe(process.stderr)
        if (!self.quiet) {
            self.gst.stdout.pipe(process.stdout);
            console.log("GStreamer started [ " + self.cmd + " " + args.join(" ") + " ]")
        }
    }).listen(self.tcpport, "127.0.0.1")
    self.server.listen(self.port, self.host)
};

gstreamer.prototype.close = function () {
    if (this.io !== null) {
        this.io.close()
    }
    if (!this.quiet) {
        console.log("GStreamer stopped")
    }
}

