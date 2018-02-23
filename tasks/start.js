'use strict';

var spawn = require('child_process').spawn;
var electron = require('electron-connect').server.create();

var gulp = require('gulp');



gulp.task('start', ['build', 'liveReload'], function() {
    electron.start(['./app/dist', '--disable-updater'])
    electron.on('close', function() {
        // User closed the app. Kill the host process.
        process.exit();
    });
});

gulp.task('liveReload', ['clean', 'bundle-app'], function() {
    var watcher = gulp.watch('app/dist/*.*');
    watcher.on('change', function(event) {
        if (event.path.endsWith("index.html")) {
            console.log('File ' + event.path + ' was ' + event.type + ', live reloading electron...');
            electron.reload();
        }
    });
});