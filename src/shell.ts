// execute on main process
import { shell, ipcMain } from "electron";

export class Shell {
    start() {
        ipcMain.on("shell-open-external-browser", (_, url) => {
            if (typeof url == "string") {
                shell.openExternal(url);
            }
        });
    }
}
