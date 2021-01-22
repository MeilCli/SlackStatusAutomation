import { Injectable } from "@angular/core";
import { ShellApi } from "src/shell";

declare global {
    interface Window {
        shell: ShellApi;
    }
}

@Injectable({
    providedIn: "root",
})
export class ShellService {
    openExternalBrowser(url: string) {
        window.shell.openExternalBrowser(url);
    }
}
