var util = require("util"),
    events = require("events"),
    cluster = require("cluster"),
    path = require("path"),
    rack = null;

module.exports = rack = {
	cores: function () {
		return require("os").cpus().length;
	},
	create: function () {
		return new Rack();
	}
};

function Rack(cores) {
	events.EventEmitter.call(this);

	this._workers = {};
	this._worker_path = null;
}
util.inherits(Rack, events.EventEmitter);

Rack.prototype.start = function () {
	var cb = function () {},
	    workers = rack.cores();

	for (var i = 0; i < arguments.length; i++) {
		switch (typeof arguments[i]) {
			case "function":
				cb = arguments[i];
				break;
			case "number":
				workers = arguments[i];
		}
	}

	if (cluster.isMaster) {
		Object.defineProperty(this, "pid", {
			   value: process.pid,
			writable: false
		});
		this.emit("master-start", this);

		cluster.on("death", (function (rack) {
			return function (worker) {
				rack.emit("worker-end", worker, rack);
			};
		})(this));

		for (i = 0; i < workers; i++) {
			this.worker();
		}

		cb(this);
	} else {
		if (this._worker_path !== null) {
			require(this._worker_path);
		} else {
			this.emit("worker-start", process);
		}

		process.on("message", (function (rack) {
			return function (msg) {
				if (msg.hasOwnProperty("_queryId")) {
					// ignore core messages
					return;
				}
				rack.emit("message", msg, process, rack);
			};
		})(this));
	}

	return this;
};
Rack.prototype.monitor = function (max, freq) {
	if (!this._monitor) {
		this._monitor = require("./monitor");
		this._monitor.init(this);
	}

	this._monitor.start(max, freq);
};
Rack.prototype.worker = function () {
	if (arguments.length > 0 && typeof arguments[0] == "string") {
		// do not start a worker, just save a worker
		// file path to require later
		this._worker_path = path.join(path.dirname(require.main.filename), arguments[0]);
		return this;
	}

	var worker = cluster.fork();

	worker.on("message", (function (rack) {
		return function (msg) {
			if (msg.hasOwnProperty("_queryId")) {
				// ignore core messages
				return;
			}
			rack.emit("message", msg, worker, rack);
		};
	})(this));

	this._workers[worker.pid] = worker;

	return this;
};
Rack.prototype.broadcast = function (msg) {
	for (var pid in this._workers) {
		if (!this._workers.hasOwnProperty(pid)) continue;

		this._workers[pid].send(msg);
	}

	return this;
};
Rack.prototype.restart = function (interval, cb) {
	var worker_pids = Object.keys(this._workers), rack = this;
	var restartNextWorker = function () {
		if (worker_pids.length === 0) {
			rack._monitor && rack._monitor.pause(false);

			if (typeof cb == "function") {
				cb();
			}
			return;
		}

		var pid = worker_pids.pop();

		setTimeout(function () {
			rack._workers[pid].kill();
			rack.worker();
			restartNextWorker();
		}, interval);
	};

	this._monitor && this._monitor.pause();

	restartNextWorker();
};
