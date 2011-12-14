var util = require("util"),
    events = require("events"),
    cluster = require("cluster"),
    rack = null;

module.exports = rack = {
	cores: function () {
		return require("os").cpus().length;
	},
	create: function () {
		return new Rack();
	}
}

function Rack(cores) {
	events.EventEmitter.call(this);
}
util.inherits(Rack, events.EventEmitter);

Rack.prototype.start = function (workers) {
	workers || (workers = rack.cores());

	if (cluster.isMaster) {
		Object.defineProperty(this, "pid", {
			   value: process.pid,
			writable: false
		});
		this.emit("master-start", this);

		cluster.on("death", (function (rack) {
			return function (worker) {
				rack.emit("worker-end", worker, rack);
			}
		})(this));

		for (var i = 0; i < workers; i++) {
			this.worker();
		}
	} else {
		this.emit("worker-start", process);
	}
};
Rack.prototype.worker = function () {
	var worker = cluster.fork();	

	worker.on("message", (function (rack) {
		return function (msg) {
			if (msg.hasOwnProperty("_queryId")) {
				// ignore core messages
				return;
			}
			rack.emit("worker-message", msg, worker, rack);
		}
	})(this));
};