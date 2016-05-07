"use strict";

let express = require("express");
let webpack = require("webpack");
let path    = require("path");

webpack({
    target: "web",
    entry: path.resolve(__dirname, "test/test.jsx"),
    output: {
        path: path.resolve(__dirname, "test/build/"),
        publicPath: "/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel",
                exclude: path.resolve(__dirname, "node_modules"),
                query: {
                    presets: [
                        "react",
                        "es2015"
                    ]
                }
            }, {
                test: /\.scss$/,
                loader: "style!css!sass",
                exclude: path.resolve(__dirname, "node_modules")
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "url-loader?limit=8192",
                exclude: path.resolve(__dirname, "node_modules")
            }, {
                test: /\.json$/,
                loader: "json",
                exclude: path.resolve(__dirname, "node_modules")
            }
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
}).watch({ aggregateTimeout: 300 }, (err, stats) => {
    if (err || stats.hasErrors() || stats.hasWarnings()) {
    	console.log(err);
        console.log(stats.toString({ colors: true }));
        return;
    }

    console.log("Completed webpack build successfully");
});

let app = express();

// Serve test content
app.use("/", express.static(__dirname + "/test"));
app.use("/", express.static(__dirname + "/test/build"));

let server = app.listen(3000, function() {
	console.log("Server started on %s:%s", server.address().address, server.address().port);
});
