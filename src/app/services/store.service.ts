import { Injectable } from "@angular/core";
import { ipcRenderer } from "electron";
import * as Store from "electron-store";
import { Account, Emoji, EmojiAlias, StatusAutomation, Status } from "../entities";

@Injectable({
    providedIn: "root",
})
export class StoreService {
    private accountsKey = "tokens";
    // not for security, for obfuscation
    private accountStore = new Store<Record<string, Account[]>>({ encryptionKey: "SlackStatusAutomation" });
    private languageKey = "language";
    private languageStore = new Store<Record<string, string>>({ name: "language" });

    constructor() {}

    async addAccount(token: string, userId: string, userName: string, teamId: string, teamName: string) {
        await ipcRenderer.invoke("store-add-account", token, userId, userName, teamId, teamName);
    }

    async clearAccounts() {
        await ipcRenderer.invoke("store-clear-accounts");
    }

    async getAccounts(): Promise<Account[]> {
        return (await ipcRenderer.invoke("store-get-accounts")) as Account[];
    }

    async updateIntervalSeconds(userId: string, teamId: string, intervalSeconds: number) {
        await ipcRenderer.invoke("store-update-interval-seconds", userId, teamId, intervalSeconds);
    }

    async updateAutomationEnabled(userId: string, teamId: string, automationEnabled: boolean) {
        await ipcRenderer.invoke("store-update-automation-enabled", userId, teamId, automationEnabled);
    }

    async updateEmojiList(userId: string, teamId: string, emojiList: (Emoji | EmojiAlias)[]) {
        await ipcRenderer.invoke("store-update-emoji-list", userId, teamId, emojiList);
    }

    async updateStatusAutomations(userId: string, teamId: string, statusAutomations: StatusAutomation[]) {
        await ipcRenderer.invoke("store-update-status-automations", userId, teamId, statusAutomations);
    }

    async updateDefaultStatus(userId: string, teamId: string, defaultStatus: Status) {
        await ipcRenderer.invoke("store-update-default-status", userId, teamId, defaultStatus);
    }

    async getLanguage(): Promise<string> {
        return (await ipcRenderer.invoke("store-get-language")) as string;
    }

    async setLanguage(value: string) {
        await ipcRenderer.invoke("store-set-language", value);
    }
}
