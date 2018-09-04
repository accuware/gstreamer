module.exports = new gstreamer()

function gstreamer() {
    this.cp = require("child_process")
    this.fs = require("fs")
    this.net = require("net")
    this.http = require("http")
    this.https = require("https")
    this.sio = require("socket.io")
}


gstreamer.prototype._args = function () {
    return [
        "rtspsrc", "location=\"" + this.url + "\"",
        "latency=0",
        "is-live=true",         //probably outdated, but can't hurt
        "low-latency=true",     //probably outdated, but can't hurt
        "buffer-mode=auto",
        "!", "rtph264depay",
        "!", "avdec_h264",
        "!", "videoconvert",
        "!", "jpegenc", "quality=" + this.quality,
        "!", "tcpclientsink", "host=127.0.0.1", "port=" + this.tcpport
    ]
}

gstreamer.prototype.reqHandler = function (self, request, response) {

    if (self.index && request.url === "/") {
        self.fs.readFile(self.index, "utf-8", function (error, content) {
            response.writeHead(200, { "Content-Type": "text/html" });
            response.end(content);
        });
    }
}

gstreamer.prototype.start = function (options) {
    options = options || {}

    this.quiet = options.quiet || false
    this.cmd = options.cmd || "gst-launch-1.0"
    this.url = options.url || "rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov"
    this.host = options.host || undefined
    this.port = options.port || 9000
    this.quality = options.quality || 85
    this.tcpport = options.tcpport || this.port + 1   
    this.index = __dirname + "/index.html"
    this.key = options.key || null
    this.cert = options.cert || null

    let self = this
    let args = this._args()

    let secure_options

    if (this.key && this.cert) {
        secure_options = {
            key: this.fs.readFileSync(this.key),
            cert: this.fs.readFileSync(this.cert)     
        }
    }

    this.server = secure_options ?
        this.https.createServer(secure_options, (request, response) => this.reqHandler(self, request, response)) :
        this.http.createServer((request, response) => this.reqHandler(self, request, response))

    let io = self.sio.listen(self.server, { origins: '*:*' })

    this.tcp = self.net.createServer((socket) => {
        let buffer
        socket.on("data", (data) => {
            // Images might be split up into several packages. Need to concat before sending upstream
            // "Start Of Image" tag starts a new image
            if (data[0] == 0xFF && data[1] == 0xD8) {   
                if (buffer) {
                    io.emit("data", buffer)
                }
                buffer = new Buffer(data)
            }
            else {
                buffer = Buffer.concat([buffer, data])
            }
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

