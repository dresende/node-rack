## NodeJS Cluster Abstraction Layer

This is an abstraction layer based on EventEmitter to provide a
simple way of dealing with cluster support added on v0.6 of NodeJS.

## Install

    npm install rack

## Usage

    var rack = require("rack").create();
    
    rack.on("master-start", function () {
        console.log("master starting..");
    });
    rack.on("worker-start", function () {
        console.log("worker starting..");
    });
    rack.start();

## Events

### master-start(rack)

This happens once you execute your script and will trigger only
once for the master process.

### worker-start(worker)

This happens for every worker that is started. Later on this can
also happen when a worker dies and needs to start again.

### worker-end(worker, rack)

This happens when a worker dies. You can start a new one by calling
`rack.worker()`.

### worker-error()

This happens when a workers die too often.

### message(message, worker, rack)

This happens when a worker sends a message to the master and
vice-versa.

## Methods (on the `rack` object in the usage example above)

### .start(n)

Start a total of `n` workers.

### .monitor(max, freq)

Start worker monitor and start a new worker whenever one dies. If
`max` workers die during `freq` miliseconds, monitor will not restart
the last one and will trigger `worker-error` event.

### .worker()

This is the internal method to start a new worker. After calling `.start()`,
if you want to start more workers just call this method.

### .broadcast(msg)

Send a message from master to all workers. This will not work on
workers.

### .restart(interval [, cb ])

Kill all workers and start new ones with an `interval` (in ms) between them.
If `cb` is specified, it will be called in the end of the restart process.
