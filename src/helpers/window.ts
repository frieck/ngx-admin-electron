// This helper remembers the size and position of your windows (and restores
// them in that place after app relaunch).
// Can be used for more than one window, just construct many
// instances of it and give each different name.

import { app, BrowserWindow, screen } from 'electron';
let jetpack = require('fs-jetpack');

interface WindowsState {
    width: number;
    height: number;
    x?: number;
    y?: number;
}

export default function (name: string, options: WindowsState): Electron.BrowserWindow{

    let userDataDir = jetpack.cwd(app.getPath('userData'));
    let stateStoreFile = 'window-state-' + name + '.json';
    let defaultSize = {
        width: options.width,
        height: options.height
    };
    let state = {};
    let win: Electron.BrowserWindow;

    let restore = function (): WindowsState {
        let restoredState: WindowsState;
        try {
            restoredState = userDataDir.read(stateStoreFile, 'json');
        } catch (err) {
            // For some reason json can't be read (might be corrupted).
            // No worries, we have defaults.
        }
        return (<any>Object).assign({}, defaultSize, restoredState);
    };

    let getCurrentPosition = function () {
        let position = win.getPosition();
        let size = win.getSize();
        return {
            x: position[0],
            y: position[1],
            width: size[0],
            height: size[1]
        };
    };

    let windowWithinBounds = function (windowState: WindowsState, bounds: WindowsState) {
        return windowState.x >= bounds.x &&
            windowState.y >= bounds.y &&
            windowState.x + windowState.width <= bounds.x + bounds.width &&
            windowState.y + windowState.height <= bounds.y + bounds.height;
    };

    let resetToDefaults = function (windowState: WindowsState) {
        let bounds = screen.getPrimaryDisplay().bounds;
        return (<any>Object).assign({}, defaultSize, {
            x: (bounds.width - defaultSize.width) / 2,
            y: (bounds.height - defaultSize.height) / 2
        });
    };

    let ensureVisibleOnSomeDisplay = function (windowState: WindowsState) {
        let visible = screen.getAllDisplays().some(function (display) {
            return windowWithinBounds(windowState, display.bounds);
        });
        if (!visible) {
            // Window is partially or fully not visible now.
            // Reset it to safe defaults.
            return resetToDefaults(windowState);
        }
        return windowState;
    };

    let saveState = function () {
        if (!win.isMinimized() && !win.isMaximized()) {
            (<any>Object).assign(state, getCurrentPosition());
        }
        userDataDir.write(stateStoreFile, state, { atomic: true });
    };

    state = ensureVisibleOnSomeDisplay(restore());

    win = new BrowserWindow((<any>Object).assign({}, options, state));

    win.on('close', saveState);

    return win;
}
