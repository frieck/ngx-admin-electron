var spawn = require('cross-spawn');

var pathUtil = require('path');
var gulp = require('gulp');
var util = require('gulp-util');
var utils = require('../utils');
var jetpack = require('fs-jetpack');
var projectDir = jetpack;
var buildDir = projectDir.cwd('./app/dist');

gulp.task('clean', (next) => {
    return buildDir.dirAsync('.', { empty: true });
})

gulp.task('bundle-app', ['clean'], () => {
    return Promise.all([
        new Promise(function(resolve, reject) {
            if (util.env.production) {
                spawn('webpack', ['--config', './config/electron/webpack.electron.dev.js'], { stdio: 'inherit' })
                    .on('close', () => {
                        resolve();
                    });
            } else {
                spawn('webpack', ['--config', './config/electron/webpack.electron.prod.js'], { stdio: 'inherit' })
                    .on('close', () => {
                        resolve();
                    });
            }
        }),
        new Promise(function(resolve, reject) {
            gulp.src('./package.json')
                .pipe(gulp.dest('./app/dist'))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            var configFile = './config/env_' + utils.getEnvName() + '.json';
            projectDir.copy(configFile, buildDir.path('env.json'));
            resolve();
        })
    ]);
});

gulp.task('build', ['clean', 'bundle-app'], () => {
    spawn('ng', ['build', '-dop=false', '-w'], {
        cwd: './app',
        stdio: 'inherit'
    }).on('close', () => {
        console.log('done...');
    });
});