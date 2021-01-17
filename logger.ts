import { ipcMain, BrowserWindow } from "electron";

export class Logger {
    private logs: string[] = [];

    start() {
        ipcMain.on("logger-new", (_, log) => {
            if (typeof log == "string") {
                this.logs.push(log);
                for (const window of BrowserWindow.getAllWindows()) {
                    window.webContents.send("logger-logged", log);
                }
            }
        });
        ipcMain.handle("logger-get", () => {
            return this.logs;
        });
    }

    log(value: string) {
        const date = new Date().toLocaleString();
        const logText = `${date}# ${value}`;
        this.logs.push(logText);
        for (const window of BrowserWindow.getAllWindows()) {
            window.webContents.send("logger-logged", logText);
        }
    }
}
