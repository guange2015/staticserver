var http = require("http")
	 ,fs = require("fs")
	 ,path = require("path")
	 ,mime = require("mime");

var port = 8080;
argvProcess = {
	helper: function () {
		console.log("Useage:");
		console.log(process.argv[1] + " " + "-p port" + " -d folder");
	},
	port: function () {
		var pIndex = process.argv.indexOf("-p");
		if (pIndex>0 && pIndex+1 < process.argv.length) {
			return parseInt(process.argv[pIndex+1]);
		}
		return port;
	},
	folder: function () {
		var pIndex = process.argv.indexOf("-d");
		if (pIndex>0 && pIndex+1 < process.argv.length) {
			return process.argv[pIndex+1];
		}
		return __dirname;
	}
}

port = argvProcess.port();
if (port != port) {
	argvProcess.helper();
	return;
}

var folder = argvProcess.folder();

console.log("port = "+port + " folder = "+folder);

http.createServer(function (req, res) {
	filepath = path.join(folder, req.url);
	fs.stat(filepath, function (err, stats) {
		if (err) {
			console.log("500 "+filepath);
			res.statusCode = 500;
			res.end();
		} else if(stats.isFile()) {
			res.statusCode = 200;
			var contentType = mime.lookup(filepath);
			res.writeHead(200, {"Content-Type": filepath});
			console.log("200 "+ contentType +" "+filepath);
			f = fs.createReadStream(filepath);
			f.pipe(res);
		} else if(stats.isDirectory()){
			res.writeHead(200, {"Content-Type": mime.lookup("*.html")});
			res.write("<a href='#'>"+req.url+"</a>");
			res.end();
		}
	});
}).listen(port);
