'use strict';

var spawn = require('child_process').spawn;
var electron = require('electron');
var gulp = require('gulp');

gulp.task('start', ['build'], function() {
    spawn(electron, ['./app/dist', '--disable-updater'], {
            stdio: 'inherit'
        })
        .on('close', function() {
            // User closed the app. Kill the host process.
            process.exit();
        });
});