"use strict";

const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const mkdirp = require("mkdirp");

const srcDir = path.resolve(__dirname, "../src");
const destDir = path.resolve(__dirname, "..");
const imageExts = [
	".jpg",
	".png",
	".svg",
	".gif",
];

let copyFiles = (srcDir, destDir) => {
	fs.readdir(srcDir, (err, files) => {
		_.each(files, file => {
			let newSrc = path.resolve(srcDir, file);
			let newDest = path.resolve(destDir, file);

			fs.stat(newSrc, (err, stat) => {
				if (stat.isDirectory()) {
					copyFiles(newSrc, newDest);
					return;
				}

				if (imageExts.indexOf(path.extname(newSrc).toLowerCase()) == -1) return;

				mkdirp(destDir, () => {
					fs.createReadStream(newSrc).pipe(fs.createWriteStream(newDest));
				});
			});
		});
	});
}

console.log("Copying static assets...");

copyFiles(srcDir, destDir);
