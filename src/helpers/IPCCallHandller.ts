import { ipcMain, BrowserWindow } from 'electron';

interface WindowsState {
    width: number;
    height: number;
    x?: number;
    y?: number;
}

export class IPCCallHandller {

    printWin: Electron.BrowserWindow;
    ultimoRecibo: string;

    constructor(private mainWindow: Electron.BrowserWindow) {


        ipcMain.on('printUltimoRecibo', (event, args) => {
            this.printWin = new BrowserWindow({ width: 900, height: 700 });
            this.printWin.loadURL(this.ultimoRecibo);
            this.printWin.show();
        });

        ipcMain.on('printRecibo', (event, args) => {
            this.printWin.webContents.print();
            this.printWin.hide();
            console.log('Imprimindo recibo...');
        });

        ipcMain.on('loadRecibo', (event, arg) => {
            this.ultimoRecibo = arg;
            this.printWin = new BrowserWindow({ width: 900, height: 700 });
            
            this.printWin.loadURL(this.ultimoRecibo);
            this.printWin.show();
        });
    }










}
