module.exports = new gstreamer();

function gstreamer() {
    var self = this;
    self.cp = require("child_process");
    self.fs = require("fs");
    self.net = require("net");
    self.http = require("http");
    self.sio = require("socket.io");
}

gstreamer.prototype._args = function () {
    return [
        "rtspsrc", "location=\"" + this.url + "\"",
        "latency=0",
        "is-live=true", //probably outdated, but can't hurt
        "low-latency=true", //probably outdated, but can't hurt
        "!", "decodebin",
        "!", "jpegenc", "quality=" + this.quality,
        "!", "tcpclientsink", "host=127.0.0.1", "port=" + this.tcpport
    ];
};

gstreamer.prototype.start = function (options) {
    var self = this;
    options = options || {};
    self.quiet = options.quiet || false;
    self.cmd = options.cmd || "gst-launch-1.0";
    self.url = options.url || "rtsp://r3---sn-a5m7zu76.c.youtube.com/CiILENy73wIaGQnup-1SztVOYBMYDSANFEgGUgZ2aWRlb3MM/0/0/0/video.3gp";
    self.host = options.host || undefined;
    self.port = options.port || 80;
    self.suffix = options.suffix || "/cam0";
    self.quality = options.quality || 85;
    self.tcpport = options.tcpport || 6161; //internal socket    
    self.index = __dirname + "/index.html";

    var args = self._args();
    self.server = self.http.createServer(function (request, response) {
        if (self.index && request.url === "/") {
            self.fs.readFile(self.index, "utf-8", function (error, content) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(content);
            });
            console.log("Index loaded");
        }
    });
    var io = self.sio.listen(self.server);
    var cam0 = io.of(self.suffix);
    cam0.on("connection", function (request, response) {
        console.log("Client connected");
    });
    self.tcp = self.net.createServer(function (socket) {
        socket.on("data", function (data) {
            cam0.emit("data", data);
        });
    }).on("listening", function () {
        self.gst = self.cp.spawn(self.cmd, args);
        self.gst.stderr.pipe(process.stderr);
        if (!self.quiet) {
            self.gst.stdout.pipe(process.stdout);
            console.log("GStreamer started [ " + self.cmd + " " + args.join(" ") + " ]");
        }
    }).listen(self.tcpport, "127.0.0.1");
    self.server.listen(self.port, self.host);
};

gstreamer.prototype.close = function () {
    var self = this;
    if (self.io !== null) {
        self.io.close();
    }
    if (!this.quiet) {
        console.log("GStreamer stopped");
    }
};


