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

### worker-message(message, worker, rack)

This happens when a worker sends a message to the master.