"use strict";

let webpack = require("webpack");
let path    = require("path");

webpack({
    entry: path.resolve(__dirname, "src/"),
    output: {
        path: path.resolve(__dirname),
        filename: "index.js",
        libraryTarget: "commonjs2"
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
            }
        ]
    },
    resolve: {
        extensions: ["", ".js", ".jsx"]
    }
}).run((err, stats) => {
    if (err || stats.hasErrors() || stats.hasWarnings()) {
    	console.log(err);
        console.log(stats.toString({ colors: true }));
        return;
    }

    console.log("Completed webpack build successfully");
});
