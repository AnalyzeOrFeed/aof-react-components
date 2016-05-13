"use strict";

const webpack = require("webpack");
const path    = require("path");
const _       = require("lodash");

let pkg = require("../package.json");
let deps = [ /^[a-z\-0-9]+$/ ]; // All non-relative dependencies are external

const modules = {
    "autocomplete": path.resolve(__dirname, "../src/autocomplete/"),
    "button": path.resolve(__dirname, "../src/button/"),
    "button-image": path.resolve(__dirname, "../src/button-image/"),
    "game": path.resolve(__dirname, "../src/game/"),
    "modal": path.resolve(__dirname, "../src/modal/"),
    "object-image": path.resolve(__dirname, "../src/object-image/"),
    "searchable-modal": path.resolve(__dirname, "../src/searchable-modal/"),
    "spinner": path.resolve(__dirname, "../src/spinner/"),
    "tooltip": path.resolve(__dirname, "../src/tooltip/"),
};

// Add local modules as external modules for one-another
deps = deps.concat(_.map(_.keys(modules), item => new RegExp("\/" + item)));

// Add main index file to webpack entries, but not to external modules,
// otherwise webpack matches every dependency as external
modules["."] = path.resolve(__dirname, "../src/"),

// Build each module
_.each(modules, (entry, name) => {
    webpack({
        target: "node",
        entry: entry,
        output: {
            path: path.resolve(__dirname, "../", name),
            publicPath: "/",
            filename: "index.js",
            libraryTarget: "commonjs2",
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
            extensions: ["", ".js", ".jsx"]
        },
        externals: deps,
    }).run((err, stats) => {
        if (err) console.log(err);
        
        console.log(stats.toString({ colors: true }));
        console.log(name + " completed webpack build");
    });
});
