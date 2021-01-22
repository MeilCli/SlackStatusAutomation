// execute on main process
import { shell, ipcMain, ipcRenderer } from "electron";

export interface ShellApi {
    openExternalBrowser: (url: string) => void;
}

export const shellApi: ShellApi = {
    openExternalBrowser: (url: string) => {
        ipcRenderer.send("shell-open-external-browser", url);
    },
};

export class Shell {
    start() {
        ipcMain.on("shell-open-external-browser", (_, url) => {
            if (typeof url == "string") {
                shell.openExternal(url);
            }
        });
    }
}
