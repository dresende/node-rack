var rack = require("../lib/rack").create();

rack.on("master-start", startMaster);
rack.on("worker-start", startWorker);
rack.on("worker-end", function (worker) {
	console.log("[%d] worker died", worker.pid);
});
rack.on("worker-error", function () {
	console.log("[!] workers dying to quickly");
	process.exit(1);
});
// let 2 workers die in a 5 second frequency
rack.monitor(2, 5000);
rack.start();

function startMaster(rack) {
	console.log("[%d] master started", rack.pid);
}

function startWorker(worker) {
	console.log("[%d] worker started", worker.pid);

	// Will drop dead in 2 seconds
	setTimeout(function () {
		worker.exit(0);
	}, 2000);
}