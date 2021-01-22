// execute on main process
import { ipcMain, ipcRenderer, app } from "electron";
import * as ElectronStore from "electron-store";
import { Account, Emoji, EmojiAlias, StatusAutomation, Status } from "./app/entities";

export interface StoreApi {
    addAccount: (token: string, userId: string, userName: string, teamId: string, teamName: string) => Promise<void>;
    clearAccounts: () => Promise<void>;
    getAccounts: () => Promise<Account[]>;
    updateIntervalSeconds: (userId: string, teamId: string, intervalSeconds: number) => Promise<void>;
    updateAutomationEnabled: (userId: string, teamId: string, automationEnabled: boolean) => Promise<void>;
    updateEmojiList: (userId: string, teamId: string, emojiList: (Emoji | EmojiAlias)[]) => Promise<void>;
    updateStatusAutomations: (userId: string, teamId: string, statusAutomations: StatusAutomation[]) => Promise<void>;
    updateDefaultStatus: (userId: string, teamId: string, defaultStatus: Status) => Promise<void>;
    getLanguage: () => Promise<string>;
    setLanguage: (value: string) => Promise<void>;
}

export const storeApi: StoreApi = {
    addAccount: async (token: string, userId: string, userName: string, teamId: string, teamName: string) => {
        await ipcRenderer.invoke("store-add-account", token, userId, userName, teamId, teamName);
    },
    clearAccounts: async () => {
        await ipcRenderer.invoke("store-clear-accounts");
    },
    getAccounts: async () => {
        return (await ipcRenderer.invoke("store-get-accounts")) as Account[];
    },
    updateIntervalSeconds: async (userId: string, teamId: string, intervalSeconds: number) => {
        await ipcRenderer.invoke("store-update-interval-seconds", userId, teamId, intervalSeconds);
    },
    updateAutomationEnabled: async (userId: string, teamId: string, automationEnabled: boolean) => {
        await ipcRenderer.invoke("store-update-automation-enabled", userId, teamId, automationEnabled);
    },
    updateEmojiList: async (userId: string, teamId: string, emojiList: (Emoji | EmojiAlias)[]) => {
        await ipcRenderer.invoke("store-update-emoji-list", userId, teamId, emojiList);
    },
    updateStatusAutomations: async (userId: string, teamId: string, statusAutomations: StatusAutomation[]) => {
        await ipcRenderer.invoke("store-update-status-automations", userId, teamId, statusAutomations);
    },
    updateDefaultStatus: async (userId: string, teamId: string, defaultStatus: Status) => {
        await ipcRenderer.invoke("store-update-default-status", userId, teamId, defaultStatus);
    },
    getLanguage: async () => {
        return (await ipcRenderer.invoke("store-get-language")) as string;
    },
    setLanguage: async (value: string) => {
        await ipcRenderer.invoke("store-set-language", value);
    },
};

const defaultIntervalSeconds = 180;

export class Store {
    private accountsKey = "tokens";
    // not for security, for obfuscation
    private accountStore = new ElectronStore<Record<string, Account[]>>({ encryptionKey: "SlackStatusAutomation" });
    private languageKey = "language";
    private languageStore = new ElectronStore<Record<string, string>>({ name: "language" });

    start() {
        ipcMain.handle("store-add-account", (_, token, userId, userName, teamId, teamName) => {
            if (
                typeof token != "string" ||
                typeof userId != "string" ||
                typeof userId != "string" ||
                typeof userName != "string" ||
                typeof teamId != "string" ||
                typeof teamName != "string"
            ) {
                throw Error();
            }
            this.addAccount(token, userId, userName, teamId, teamName);
        });
        ipcMain.handle("store-clear-accounts", () => {
            this.clearAccounts();
        });
        ipcMain.handle("store-get-accounts", () => {
            return this.getAccounts();
        });
        ipcMain.handle("store-update-interval-seconds", (_, userId, teamId, intervalSeconds) => {
            if (typeof userId != "string" || typeof teamId != "string" || typeof intervalSeconds != "number") {
                throw Error();
            }
            this.updateIntervalSeconds(userId, teamId, intervalSeconds);
        });
        ipcMain.handle("store-update-automation-enabled", (_, userId, teamId, automationEnabled) => {
            if (typeof userId != "string" || typeof teamId != "string" || typeof automationEnabled != "boolean") {
                throw Error();
            }
            this.updateAutomationEnabled(userId, teamId, automationEnabled);
        });
        ipcMain.handle("store-update-emoji-list", (_, userId, teamId, emojiList) => {
            if (typeof userId != "string" || typeof teamId != "string" || typeof emojiList != "object") {
                throw Error();
            }
            this.updateEmojiList(userId, teamId, emojiList as (Emoji | EmojiAlias)[]);
        });
        ipcMain.handle("store-update-status-automations", (_, userId, teamId, statusAutomations) => {
            if (typeof userId != "string" || typeof teamId != "string" || typeof statusAutomations != "object") {
                throw Error();
            }
            this.updateStatusAutomations(userId, teamId, statusAutomations as StatusAutomation[]);
        });
        ipcMain.handle("store-update-default-status", (_, userId, teamId, defaultStatus) => {
            if (typeof userId != "string" || typeof teamId != "string" || typeof defaultStatus != "object") {
                throw Error();
            }
            this.updateDefaultStatus(userId, teamId, defaultStatus as Status);
        });
        ipcMain.handle("store-get-language", () => {
            return this.languageStore.get(this.languageKey, app.getLocale());
        });
        ipcMain.handle("store-set-language", (_, value) => {
            if (typeof value != "string") {
                throw Error();
            }
            this.languageStore.set(this.languageKey, value);
        });
    }

    addAccount(token: string, userId: string, userName: string, teamId: string, teamName: string) {
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

    clearAccounts() {
        this.accountStore.delete(this.accountsKey);
    }

    getAccounts(): Account[] {
        return this.accountStore.get(this.accountsKey, []);
    }

    updateIntervalSeconds(userId: string, teamId: string, intervalSeconds: number) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].intervalSeconds = intervalSeconds;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    updateAutomationEnabled(userId: string, teamId: string, automationEnabled: boolean) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].automationEnabled = automationEnabled;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    updateEmojiList(userId: string, teamId: string, emojiList: (Emoji | EmojiAlias)[]) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].emojiList = emojiList;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    updateStatusAutomations(userId: string, teamId: string, statusAutomations: StatusAutomation[]) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].statusAutomations = statusAutomations;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    updateDefaultStatus(userId: string, teamId: string, defaultStatus: Status) {
        const accounts = this.accountStore.get(this.accountsKey, []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].defaultStatus = defaultStatus;
            this.accountStore.set(this.accountsKey, accounts);
        }
    }

    getLanguage(): string {
        return this.languageStore.get(this.languageKey, navigator.language);
    }

    setLanguage(value: string) {
        this.languageStore.set(this.languageKey, value);
    }
}
