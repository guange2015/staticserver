var http = require("http")
	 ,fs = require("fs")
	 ,path = require("path")
	 ,mime = require("mime");

var port = 8080;
if (process.argv.length >= 3) {
	port = parseInt(process.argv[2]);
}

http.createServer(function (req, res) {
	filepath = path.join(__dirname, req.url);
	console.log(filepath);
	fs.stat(filepath, function (err, stats) {
		if (err) {
			res.statusCode = 500;
			res.end();
		} else if(stats.isFile()) {
			res.statusCode = 200;
			res.writeHead(200, {"Content-Type": mime.lookup(filepath)});
			f = fs.createReadStream(filepath);
			f.pipe(res);
		}
	});
}).listen(port);
