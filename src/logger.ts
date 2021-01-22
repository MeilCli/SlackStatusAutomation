// execute on main process
import { ipcMain, ipcRenderer, BrowserWindow } from "electron";

export interface LoggerApi {
    logged: (handler: (log: string) => void) => void;
    new: (log: string) => void;
    get: () => Promise<string[]>;
}

export const loggerApi: LoggerApi = {
    logged: (handler: (log: string) => void) => {
        ipcRenderer.on("logger-logged", (_, log) => {
            if (typeof log == "string") {
                handler(log);
            }
        });
    },
    new: (log: string) => {
        ipcRenderer.send("logger-new", log);
    },
    get: async () => {
        return (await ipcRenderer.invoke("logger-get")) as string[];
    },
};

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
