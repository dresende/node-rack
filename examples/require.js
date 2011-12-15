var rack = require("../lib/rack").create();

// path to run for every worker
rack.worker("./require_worker");

// start 3 workers
rack.start(3, function (rack) {
	console.log("[%d] master started", rack.pid);
});