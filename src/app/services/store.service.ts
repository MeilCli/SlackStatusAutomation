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
    private store = new Store<Record<string, Account[]>>({ encryptionKey: "SlackStatusAutomation" });

    constructor() {}

    addAccount(token: string, userId: string, userName: string, teamId: string, teamName: string) {
        const accounts = this.store.get(this.accountsKey, []);
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

        this.store.set(this.accountsKey, accounts);
    }

    clearAccounts() {
        this.store.delete(this.accountsKey);
    }

    getAccounts(): Account[] {
        return this.store.get(this.accountsKey, []);
    }

    updateIntervalSeconds(userId: string, teamId: string, intervalSeconds: number) {
        const accounts = this.store.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].intervalSeconds = intervalSeconds;
            this.store.set(this.accountsKey, accounts);
        }
    }

    updateAutomationEnabled(userId: string, teamId: string, automationEnabled: boolean) {
        const accounts = this.store.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].automationEnabled = automationEnabled;
            this.store.set(this.accountsKey, accounts);
        }
    }

    updateEmojiList(userId: string, teamId: string, emojiList: (Emoji | EmojiAlias)[]) {
        const accounts = this.store.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].emojiList = emojiList;
            this.store.set(this.accountsKey, accounts);
        }
    }

    updateStatusAutomations(userId: string, teamId: string, statusAutomations: StatusAutomation[]) {
        const accounts = this.store.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].statusAutomations = statusAutomations;
            this.store.set(this.accountsKey, accounts);
        }
    }

    updateDefaultStatus(userId: string, teamId: string, defaultStatus: Status) {
        const accounts = this.store.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].defaultStatus = defaultStatus;
            this.store.set(this.accountsKey, accounts);
        }
    }
}
