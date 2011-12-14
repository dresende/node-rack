var rack = require("../lib/rack").create();

rack.on("master-start", startMaster);
rack.on("worker-start", startWorker);
rack.start();

function startMaster(rack) {
	console.log("[%d] master started", rack.pid);
}

function startWorker(worker) {
	console.log("[%d] worker started", worker.pid);

	require("http").createServer(function (req, res) {
		console.log("[%d] %s", worker.pid, req.url);

		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("Your requested " + req.url);
	}).listen(1337);
}