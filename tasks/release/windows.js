'use strict';

var Q = require('q');
var gulpUtil = require('gulp-util');
var childProcess = require('child_process');
var jetpack = require('fs-jetpack');
var utils = require('../utils');
var packager = require('electron-packager');
var electronInstaller = require('electron-winstaller');

var projectDir;
var tmpDir;
var releasesDir;
var readyAppDir;
var manifest;
var arch;

var init = function() {
    projectDir = jetpack;
    tmpDir = projectDir.dir('./tmp', {
        empty: true
    });
    manifest = projectDir.read('package.json', 'json');

    return new Q();
};

var cleanupRuntime = function() {
    return readyAppDir.removeAsync('resources/default_app');
};

var finalize = function() {
    var deferred = Q.defer();

    projectDir.copy('resources/windows/icon.ico', readyAppDir.path('icon.ico'));

    // Replace Electron icon for your own.
    var rcedit = require('rcedit');
    rcedit(readyAppDir.path(manifest.exeName + '.exe'), {
        'icon': readyAppDir.path('icon.ico'),
        'version-string': {
            'ProductName': manifest.productName,
            'FileDescription': manifest.description,
            'ProductVersion': manifest.version,
            'CompanyName': manifest.companyName, // it might be better to add another field to package.json for this
            'LegalCopyright': manifest.copyright,
            'OriginalFilename': manifest.productName + '.exe'
        }
    }, function(err) {
        if (!err) {
            deferred.resolve();
        } else {
            console.log(err);
        }
    });

    return deferred.promise;
};

var createWinstaller = function() {

    var opts = {
        appDirectory: readyAppDir.path(),
        outputDirectory: releasesDir.path(),
        authors: manifest.author,
        exe: manifest.exeName + '.exe',
        name: manifest.exeName,
        setupIcon: projectDir.path('resources/windows/setup-icon.ico'),
        iconUrl: projectDir.path('resources/windows/icon.ico'),
        setupExe: `Setup-${manifest.version}-${arch == 'ia32' ? 'x86' : 'x64'}.exe`
    }

    return electronInstaller.createWindowsInstaller(opts);
}

var packApp_IA32 = function() {
    var deferred = Q.defer();

    packager({
        platform: "win32",
        arch: "ia32",
        name: manifest.exeName,
        dir: projectDir.path('app/dist'),
        out: tmpDir.path(),
        asar: {
            unpack: '{*.node,env.json}'
        },
        overwrite: true
    }, function done_callback(err, appPaths) {
        readyAppDir = projectDir.dir(appPaths[0]);
        releasesDir = projectDir.dir('./releases/ia32');
        arch = "ia32";
        deferred.resolve();
    });

    return deferred.promise;
}

var packApp_X64 = function() {
    var deferred = Q.defer();

    packager({
        platform: "win32",
        arch: "x64",
        name: manifest.exeName,
        dir: projectDir.path('app/dist'),
        out: tmpDir.path(),
        asar: {
            unpack: '{*.node,env.json}'
        },
        overwrite: true
    }, function done_callback(err, appPaths) {
        readyAppDir = projectDir.dir(appPaths[0]);
        releasesDir = projectDir.dir('./releases/x64');
        arch = "x64";
        deferred.resolve();
    });

    return deferred.promise;
}

module.exports = function() {
    var deferred = Q.defer();
    init()
        .then(packApp_IA32)
        .then(cleanupRuntime)
        .then(finalize)
        .then(createWinstaller)
        .then(packApp_X64)
        .then(cleanupRuntime)
        .then(finalize)
        .then(createWinstaller)
        .then(() => {
            deferred.resolve();
        })
        .catch(console.error);

    return deferred.promise;
};