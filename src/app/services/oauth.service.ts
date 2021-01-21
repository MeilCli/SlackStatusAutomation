import { Injectable } from "@angular/core";
import { ipcRenderer } from "electron";

@Injectable({
    providedIn: "root",
})
export class OauthService {
    start(handler: (code: string) => void) {
        ipcRenderer.send("oauth-start");
        ipcRenderer.on("oauth-callback", (_, arg) => {
            if (typeof arg == "string") {
                handler(arg);
            }
        });
    }

    end() {
        ipcRenderer.send("oauth-end");
        ipcRenderer.removeAllListeners("oauth-callback");
    }
}
