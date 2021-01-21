import { Injectable } from "@angular/core";
import { ipcRenderer } from "electron";

@Injectable({
    providedIn: "root",
})
export class ShellService {
    openExternalBrowser(url: string) {
        ipcRenderer.send("shell-open-external-browser", url);
    }
}
