import { Injectable } from "@angular/core";
import { ipcRenderer } from "electron";
import { StoreService } from "./store.service";

@Injectable({
    providedIn: "root",
})
export class AutomationService {
    constructor(private readonly storeService: StoreService) {}

    async startApplication() {
        const accounts = await this.storeService.getAccounts();
        ipcRenderer.send("automation-update", accounts);
    }

    async updateAccount() {
        const accounts = await this.storeService.getAccounts();
        ipcRenderer.send("automation-update", accounts);
    }
}
