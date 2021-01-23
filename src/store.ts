// execute on main process
import { ipcMain, ipcRenderer, app } from "electron";
import * as ElectronStore from "electron-store";
import { Account, Emoji, EmojiAlias, StatusAutomation, Status } from "./app/entities";

export interface StoreApi {
    addAccount: (token: string, userId: string, userName: string, teamId: string, teamName: string) => Promise<void>;
    clearAccounts: () => Promise<void>;
    getAccounts: () => Promise<Account[]>;
    getCurrentAccount: () => Promise<Account | null>;
    setCurrentAccount: (userId: string, teamId: string) => Promise<void>;
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
    getCurrentAccount: async () => {
        return (await ipcRenderer.invoke("store-get-current-account")) as Account | null;
    },
    setCurrentAccount: async (userId: string, teamId: string) => {
        await ipcRenderer.invoke("store-set-current-account", userId, teamId);
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

type StoreType = {
    accounts: Account[];
    currentAccount: { userId: string; teamId: string };
    language: string;
};

export class Store {
    // not for security, for obfuscation
    private store = new ElectronStore<StoreType>({ encryptionKey: "SlackStatusAutomation" });

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
        ipcMain.handle("store-get-current-account", () => {
            return this.getCurrentAccount();
        });
        ipcMain.handle("store-set-current-account", (_, userId, teamId) => {
            if (typeof userId != "string" || typeof teamId != "string") {
                throw Error();
            }
            this.setCurrentAccount(userId, teamId);
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
            return this.getLanguage();
        });
        ipcMain.handle("store-set-language", (_, value) => {
            if (typeof value != "string") {
                throw Error();
            }
            this.setLanguage(value);
        });
    }

    addAccount(token: string, userId: string, userName: string, teamId: string, teamName: string) {
        const accounts = this.store.get("accounts", []);
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

        this.store.set("accounts", accounts);
    }

    clearAccounts() {
        this.store.delete("accounts");
    }

    getAccounts(): Account[] {
        return this.store.get("accounts", []);
    }

    getCurrentAccount(): Account | null {
        const currentAccount = this.store.get("currentAccount", { userId: "", teamId: "" });
        const accounts = this.getAccounts();
        const foundAccount = accounts.find(
            (x) => x.userId == currentAccount.userId && x.teamId == currentAccount.teamId
        );
        if (foundAccount != undefined) {
            return foundAccount;
        }
        if (0 < accounts.length) {
            return accounts[0];
        }
        return null;
    }

    setCurrentAccount(userId: string, teamId: string) {
        this.store.set("currentAccount", { userId, teamId });
    }

    updateIntervalSeconds(userId: string, teamId: string, intervalSeconds: number) {
        const accounts = this.store.get("accounts", []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].intervalSeconds = intervalSeconds;
            this.store.set("accounts", accounts);
        }
    }

    updateAutomationEnabled(userId: string, teamId: string, automationEnabled: boolean) {
        const accounts = this.store.get("accounts", []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].automationEnabled = automationEnabled;
            this.store.set("accounts", accounts);
        }
    }

    updateEmojiList(userId: string, teamId: string, emojiList: (Emoji | EmojiAlias)[]) {
        const accounts = this.store.get("accounts", []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].emojiList = emojiList;
            this.store.set("accounts", accounts);
        }
    }

    updateStatusAutomations(userId: string, teamId: string, statusAutomations: StatusAutomation[]) {
        const accounts = this.store.get("accounts", []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].statusAutomations = statusAutomations;
            this.store.set("accounts", accounts);
        }
    }

    updateDefaultStatus(userId: string, teamId: string, defaultStatus: Status) {
        const accounts = this.store.get("accounts", []);
        const foundIndex = accounts.findIndex((x) => x.userId == userId && x.teamId == teamId);
        if (0 <= foundIndex) {
            accounts[foundIndex].defaultStatus = defaultStatus;
            this.store.set("accounts", accounts);
        }
    }

    getLanguage(): string {
        return this.store.get("language", app.getLocale());
    }

    setLanguage(value: string) {
        this.store.set("language", value);
    }
}
