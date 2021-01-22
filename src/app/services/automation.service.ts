import { Injectable } from "@angular/core";
import { AutomationApi } from "src/automation";
import { StoreService } from "./store.service";

declare global {
    interface Window {
        automation: AutomationApi;
    }
}

@Injectable({
    providedIn: "root",
})
export class AutomationService {
    constructor(private readonly storeService: StoreService) {}

    async startApplication() {
        const accounts = await this.storeService.getAccounts();
        window.automation.update(accounts);
    }

    async updateAccount() {
        const accounts = await this.storeService.getAccounts();
        window.automation.update(accounts);
    }
}
