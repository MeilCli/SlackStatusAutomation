// execute on main process
import { ipcMain } from "electron";
import * as express from "express";
import { Server } from "http";

export class Oauth {
    private server: Server | null = null;

    start() {
        ipcMain.on("oauth-start", (event) => {
            const expressApp = express();
            expressApp.get("/", (req, res) => {
                const code = req.query["code"];
                if (typeof code == "string") {
                    event.sender.send("oauth-callback", code);
                    res.send("authenticated");
                } else {
                    res.send("unknown error");
                }
            });
            this.server = expressApp.listen(3333, () => {});
        });
        ipcMain.on("oauth-end", () => {
            this.server?.close();
        });
    }
}
