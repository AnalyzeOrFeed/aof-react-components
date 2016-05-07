"use strict";

const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const rimraf = require("rimraf");

const srcDir = path.resolve(__dirname, "../src");
const destDir = path.resolve(__dirname, "..");

let cleanDir = (srcDir, destDir) => {
	fs.readdir(srcDir, (err, files) => {
		_.each(files, file => rimraf(file, () => {}));
	});
}

console.log("Cleaning environment...");

cleanDir(srcDir, destDir);
