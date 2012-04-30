var rack = null,
    last_crash = null,
    config = { max: 1, freq: 60000 }, // 1 crash every 60 seconds
    started = false,
    paused = false;

module.exports = {
	init: function () {
		rack = arguments[0];

		return this;
	},
	pause: function (pause) {
		paused = (arguments.length > 0 ? !!pause : true);

		return this;
	},
	start: function (max, freq) {
		if (max) config.max = max;
		if (freq) config.freq = freq;

		if (!started) {
			rack.on("worker-end", workerEnd);

			started = true;
		}
	}
};

function workerEnd(max, freq) {
	if (paused) {
		return;
	}
	if (last_crash === null) {
		last_crash = {
			  count: 1,
			  timer: setTimeout(clearWorkerEnd, config.freq)
		};
		return rack.worker();
	}

	last_crash.count += 1;

	if (last_crash.count <= config.max) {
		return rack.worker();
	}

	rack.emit("worker-error");
}

function clearWorkerEnd() {
	last_crash = null;
}
