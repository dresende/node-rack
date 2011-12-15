// do not run this directly. Although it works, the
// intention is to run: node require.js

console.log("[%d] worker started", process.pid);

require("http").createServer(function (req, res) {
	console.log("[%d] %s", process.pid, req.url);

	res.writeHead(200, { "Content-Type": "text/plain" });
	res.end("Your requested " + req.url);
}).listen(1337);