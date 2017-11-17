'use strict';

var Q = require('q');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var fs = require('fs');
var utils = require('../utils');

var releaseForOs = {
    osx: require('./osx'),
    linux: require('./linux'),
    windows: require('./windows'),
};

gulp.task('release', ['build'], function() {
    var projectDir = jetpack;
    var manifest = projectDir.read('app/package.json', 'json');
    releaseForOs[utils.os()]().then(() => {
        fs.writeFile(projectDir.path('releases/latest-version'), manifest.version, function(err) {
            if (err) {
                return console.log(err);
            }

            console.log("Build complete! Versioning file created.");
        });
    });

});