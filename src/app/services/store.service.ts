import { Injectable } from "@angular/core";
import { StoreApi } from "src/store";
import { Account, Emoji, EmojiAlias, StatusAutomation, Status } from "../entities";

declare global {
    interface Window {
        store: StoreApi;
    }
}

@Injectable({
    providedIn: "root",
})
export class StoreService {
    async addAccount(token: string, userId: string, userName: string, teamId: string, teamName: string) {
        await window.store.addAccount(token, userId, userName, teamId, teamName);
    }

    async removeAccount(userId: string, teamId: string) {
        await window.store.removeAccount(userId, teamId);
    }

    async getAccounts(): Promise<Account[]> {
        return await window.store.getAccounts();
    }

    async getCurrentAccount(): Promise<Account | null> {
        return await window.store.getCurrentAccount();
    }

    async setCurrentAccount(userId: string, teamId: string) {
        await window.store.setCurrentAccount(userId, teamId);
    }

    async updateIntervalSeconds(userId: string, teamId: string, intervalSeconds: number) {
        await window.store.updateIntervalSeconds(userId, teamId, intervalSeconds);
    }

    async updateAutomationEnabled(userId: string, teamId: string, automationEnabled: boolean) {
        await window.store.updateAutomationEnabled(userId, teamId, automationEnabled);
    }

    async updateEmojiList(userId: string, teamId: string, emojiList: (Emoji | EmojiAlias)[]) {
        await window.store.updateEmojiList(userId, teamId, emojiList);
    }

    async updateStatusAutomations(userId: string, teamId: string, statusAutomations: StatusAutomation[]) {
        await window.store.updateStatusAutomations(userId, teamId, statusAutomations);
    }

    async updateDefaultStatus(userId: string, teamId: string, defaultStatus: Status) {
        await window.store.updateDefaultStatus(userId, teamId, defaultStatus);
    }

    async getLanguage(): Promise<string> {
        return await window.store.getLanguage();
    }

    async setLanguage(value: string) {
        await window.store.setLanguage(value);
    }
}
