"use strict";

const express = require("express");
const webpack = require("webpack");
const path    = require("path");

webpack({
    target: "web",
    entry: path.resolve(__dirname, "../test/index.jsx"),
    output: {
        path: path.resolve(__dirname, "../test/build/"),
        publicPath: "/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "babel",
                exclude: path.resolve(__dirname, "../node_modules/"),
                query: {
                    presets: [ "react", "es2015" ]
                }
            }, {
                test: /\.scss$/,
                loader: "style!css!sass",
                exclude: path.resolve(__dirname, "../node_modules/"),
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "url-loader?limit=8192",
                exclude: path.resolve(__dirname, "../node_modules/"),
            }, {
                test: /\.json$/,
                loader: "json",
                exclude: path.resolve(__dirname, "../node_modules/"),
            }
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"],
		alias: {
			"assets": path.resolve(__dirname, "../src/_assets"),
			"propTypes": path.resolve(__dirname, "../src/_propTypes"),
		}
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
app.use("/", express.static(path.resolve(__dirname, "../test")));
app.use("/", express.static(path.resolve(__dirname, "../test/build")));

let server = app.listen(3000, function() {
	console.log("Server started on %s:%s", server.address().address, server.address().port);
});
