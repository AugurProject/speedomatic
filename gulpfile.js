"use strict";

var path = require("path");
var cp = require("child_process");
var gulp = require("gulp");
var del = require("del");

gulp.task("clean", function (callback) {
  del([path.join("dist", "*.js")], callback);
});

gulp.task("lint", function (callback) {
  cp.exec("npm run lint", function (err, stdout) {
    if (err) if (stdout) process.stdout.write(stdout);
    callback(err);
  });
});

gulp.task("test", function (callback) {
  cp.exec("npm test", function (err, stdout) {
    if (err) if (stdout) process.stdout.write(stdout);
    callback(err);
  });
});

gulp.task("build", function (callback) {
  del([path.join("dist", "*.js")], function (err) {
    if (err) throw err;
    cp.exec("./node_modules/browserify/bin/cmd.js ./exports.js | "+
            "./node_modules/uglify-js/bin/uglifyjs > ./dist/augur-abi.min.js",
            function (err, stdout) {
              if (err) throw err;
              if (stdout) process.stdout.write(stdout);
              cp.exec("./node_modules/browserify/bin/cmd.js ./exports.js "+
                "> ./dist/augur-abi.js",
                function (err, stdout) {
                  if (err) throw err;
                  if (stdout) process.stdout.write(stdout);
                  callback();
                });
            });
  });
});

gulp.task("default", ["lint", "test", "build"]);
