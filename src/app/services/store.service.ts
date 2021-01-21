import { Injectable } from "@angular/core";
import * as Store from "electron-store";
import { Account, Emoji, EmojiAlias, StatusAutomation, Status } from "../entities";

const defaultIntervalSeconds = 180;

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
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].token = token;
        } else {
            accounts.push({
                token,
                userId,
                userName,
                teamId,
                teamName,
                intervalSeconds: defaultIntervalSeconds,
                automationEnabled: false,
                emojiList: [],
                statusAutomations: [],
                defaultStatus: { emoji: null, message: "" },
            });
        }

        this.accountStore.set(this.accountsKey, accounts);
    }

    async clearAccounts() {
        this.accountStore.delete(this.accountsKey);
    }

    async getAccounts(): Promise<Account[]> {
        return this.accountStore.get(this.accountsKey, []);
    }

    async updateIntervalSeconds(userId: string, teamId: string, intervalSeconds: number) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].intervalSeconds = intervalSeconds;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    async updateAutomationEnabled(userId: string, teamId: string, automationEnabled: boolean) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].automationEnabled = automationEnabled;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    async updateEmojiList(userId: string, teamId: string, emojiList: (Emoji | EmojiAlias)[]) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].emojiList = emojiList;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    async updateStatusAutomations(userId: string, teamId: string, statusAutomations: StatusAutomation[]) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].statusAutomations = statusAutomations;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    async updateDefaultStatus(userId: string, teamId: string, defaultStatus: Status) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].defaultStatus = defaultStatus;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    async getLanguage(): Promise<string> {
        return this.languageStore.get(this.languageKey, navigator.language);
    }

    async setLanguage(value: string) {
        this.languageStore.set(this.languageKey, value);
    }
}
