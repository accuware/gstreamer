module.exports = new gstreamer()

function gstreamer() {
    this.cp = require("child_process")
    this.fs = require("fs")
    this.net = require("net")
    this.http = require("http")
    this.sio = require("socket.io")
}


gstreamer.prototype._args = function () {
    return [
        "rtspsrc", "location=\"" + this.url + "\"",
 //       "latency=0",
 //       "is-live=true",         //probably outdated, but can't hurt
 //       "low-latency=true",     //probably outdated, but can't hurt
 //       "buffer-mode=auto",
        "!", "rtph264depay",
        "!", "avdec_h264",
        "!", "videoconvert",
        "!", "jpegenc", "quality=" + this.quality,
        "!", "tcpclientsink", "host=127.0.0.1", "port=" + this.tcpport
    ];
};

gstreamer.prototype.start = function (options) {
    options = options || {}

    this.quiet = options.quiet || false
    this.cmd = options.cmd || "gst-launch-1.0"              
    this.url = options.url || "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov"
    this.host = options.host || undefined
    this.port = options.port || 9000
    this.quality = options.quality || 85
    this.tcpport = this.port + 1         // internal socket for listening on incoming video frames   
    this.index = __dirname + "/index.html"

    let self = this
    let args = this._args()

    this.server = this.http.createServer(function (request, response) {
        if (self.index && request.url === "/") {
            self.fs.readFile(self.index, "utf-8", function (error, content) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(content);
            });
            console.log("Index loaded");
        }
    })
    let io = self.sio.listen(self.server, {origins: '*:*'})

    this.tcp = self.net.createServer((socket) => {
        socket.on("data", (data) => {
           io.emit("data", data)
        })
    }).on("listening", () => {
        self.gst = self.cp.spawn(self.cmd, args)
        self.gst.stderr.pipe(process.stderr)
        if (!self.quiet) {
            self.gst.stdout.pipe(process.stdout);
            console.log("GStreamer started [ " + self.cmd + " " + args.join(" ") + " ]")
        }
    }).listen(this.tcpport, "127.0.0.1")
    this.server.listen(this.port, this.host)
}

gstreamer.prototype.close = function () {
    if (this.io !== null) {
        this.io.close()
    }
    if (!this.quiet) {
        console.log("GStreamer stopped")
    }
}

