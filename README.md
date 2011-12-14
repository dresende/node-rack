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
