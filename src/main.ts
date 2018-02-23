// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, BrowserWindow } from 'electron';
import devMenuTemplate from './helpers/menu_template';
import createWindow from './helpers/window';
import { IPCCallHandller } from './helpers/IPCCallHandller';
let client = require('electron-connect').client;


// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

let mainWindow: BrowserWindow;

let menu: Menu;

let envData = env();

let setApplicationMenu = function (mw: BrowserWindow) {
    Menu.setApplicationMenu(Menu.buildFromTemplate(devMenuTemplate(mw)));
};

let isInternalDebugDisabled = function(): Boolean {
    let internalDebugDisabled = false;
    let args = process.argv;
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--disableInternalDebug') {
            internalDebugDisabled = true;
            break;
        }
    }
    return internalDebugDisabled;
};

app.on('ready', function () {
    mainWindow = createWindow('main', {
        width: 1000,
        height: 600
    });

    setApplicationMenu(mainWindow);
    let ipcHandller = new IPCCallHandller(mainWindow);

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    if (envData.name !== 'production' &&  !isInternalDebugDisabled()) {
        mainWindow.webContents.openDevTools();
    }

    console.log(envData.name);

    if (envData.name === 'development') {
        client.create(mainWindow);
    }
});

app.on('window-all-closed', function () {
    app.quit();
});


