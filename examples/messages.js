var rack = require("../lib/rack").create();

rack.on("master-start", startMaster);
rack.on("worker-start", startWorker);
rack.start();

function startMaster(rack) {
	console.log("[%d] master started", rack.pid);

	rack.on("message", function (msg, worker) {
		console.log("[%d (worker)] -> [%d (master)] %j", worker.pid, rack.pid, msg);
	});
}

function startWorker(worker) {
	console.log("[%d] worker started", worker.pid);

	require("http").createServer(function (req, res) {
		worker.send({ url: req.url });

		console.log("[%d] %s", worker.pid, req.url);

		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("You requested " + req.url);
	}).listen(1337);
}