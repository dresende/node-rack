var rack = require("../lib/rack").create();

rack.on("master-start", startMaster);
rack.on("worker-start", startWorker);
rack.on("worker-end", endWorker);
// this monitor settings would not allow
// for rack.restart() to work
rack.monitor(1, 5000);
rack.on("worker-error", function () {
	console.log("This will never trigger because monitor will know about rack.restart()");
	process.exit(1);
});
rack.start();

function startMaster(rack) {
	console.log("[%d] master started", rack.pid);

	// restart workers in 3 secs
	setTimeout(function () {
		// interval between every worker to restart
		// (sometimes your app might not instantly
		//  restart so you might want to wait before
		//  restarting every worker)
		rack.restart(1000, function () {
			console.log("[master] all workers restarted!");
		});
	}, 3000);
}

function startWorker(worker) {
	console.log("[%d] worker started", worker.pid);

	require("http").createServer(function (req, res) {
		console.log("[%d] %s", worker.pid, req.url);

		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("Your requested " + req.url);
	}).listen(1337);
}

function endWorker(worker) {
	console.log("[%d] worker ended", worker.pid);
}