// execute on main process
import { ipcMain, ipcRenderer } from "electron";
import * as express from "express";
import { Server } from "http";

export interface OauthApi {
    start: () => void;
    callback: (handler: (code: string) => void) => void;
    end: () => void;
    removeCallback: () => void;
}

export const oauthApi: OauthApi = {
    start: () => {
        ipcRenderer.send("oauth-start");
    },
    callback: (handler: (code: string) => void) => {
        ipcRenderer.on("oauth-callback", (_, arg) => {
            if (typeof arg == "string") {
                handler(arg);
            }
        });
    },
    end: () => {
        ipcRenderer.send("oauth-end");
    },
    removeCallback: () => {
        ipcRenderer.removeAllListeners("oauth-callback");
    },
};

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
