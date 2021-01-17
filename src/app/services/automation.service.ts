import { Injectable } from "@angular/core";
import { ipcRenderer } from "electron";
import { StoreService } from "./store.service";

@Injectable({
    providedIn: "root",
})
export class AutomationService {
    constructor(private readonly storeService: StoreService) {}

    startApplication() {
        const accounts = this.storeService.getAccounts();
        ipcRenderer.send("automation-update", accounts);
    }

    updateAccount() {
        const accounts = this.storeService.getAccounts();
        ipcRenderer.send("automation-update", accounts);
    }
}
