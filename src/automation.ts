// execute on main process
import { ipcMain } from "electron";
import { setInterval, clearInterval } from "timers";
import { Account, Status, StatusAutomation } from "./app/entities";
import { createSlackClient } from "./app/slack";
import { Logger } from "./logger";
import { v4, v6 } from "public-ip";
const wifi = require("node-wifi");

export class Automation {
    private timers: AccountTimer[] = [];

    constructor(private readonly logger: Logger) {}

    start() {
        wifi.init({ iface: null });
        ipcMain.on("automation-update", (_, accounts) => {
            for (const account of accounts as Account[]) {
                const foundTimer = this.timers.find((x) => x.userId == account.userId && x.teamId == account.teamId);
                if (foundTimer != null) {
                    foundTimer.update(account);
                } else {
                    const newTimer = new AccountTimer(this.logger, account.userId, account.teamId);
                    newTimer.update(account);
                    this.timers.push(newTimer);
                }
            }
            for (const timer of this.timers) {
                const foundAccount = (accounts as Account[]).find(
                    (x) => x.userId == timer.userId && x.teamId == timer.teamId
                );
                if (foundAccount == null) {
                    timer.forceStop();
                }
            }
        });
    }

    pause() {
        for (const timer of this.timers) {
            timer.pause();
        }
    }

    resume() {
        for (const timer of this.timers) {
            timer.resume();
        }
    }
}

class AccountTimer {
    private timerId: NodeJS.Timeout | null = null;
    private cachedAccount: Account | null = null;
    private currentStatus: Status | null = null;

    constructor(private readonly logger: Logger, public readonly userId: string, public readonly teamId: string) {}

    applicationLog(value: string) {
        this.logger.log(`application: ${value}`);
    }

    accountLog(value: string, account: Account) {
        this.logger.log(`${account.teamName}:${account.userName}: ${value}`);
    }

    update(account: Account) {
        this.cachedAccount = account;
        let stopped = false;
        if (this.timerId != null) {
            clearInterval(this.timerId);
            this.accountLog("stop timer", account);
            this.timerId = null;
            stopped = true;
        }
        if (account.automationEnabled) {
            this.timerId = setInterval(() => {
                this.handle(account);
            }, account.intervalSeconds * 1000);
            if (stopped == false) {
                this.accountLog("start timer", account);
            } else {
                this.accountLog("update timer", account);
            }
        }
    }

    forceStop() {
        if (this.timerId != null) {
            clearInterval(this.timerId);
            if (this.cachedAccount != null) {
                this.accountLog("stop timer", this.cachedAccount);
            } else {
                this.applicationLog("stop unknown timer");
            }
            this.timerId = null;
        }
    }

    pause() {
        if (this.timerId != null) {
            clearInterval(this.timerId);
            if (this.cachedAccount != null) {
                this.accountLog("pause timer", this.cachedAccount);
            } else {
                this.applicationLog("pause unknown timer");
            }
            this.timerId = null;
        }
    }

    resume() {
        const account = this.cachedAccount;
        if (account == null) {
            return;
        }
        if (account.automationEnabled) {
            this.timerId = setInterval(() => {
                this.handle(account);
            }, account.intervalSeconds * 1000);
            this.accountLog("resume timer", account);
        }
    }

    async handle(account: Account) {
        this.accountLog("handle timer", account);
        let wifiList: string[] = [];
        if (this.hasWifiCondition(account)) {
            wifiList = await this.getCurrentWifi();
        }
        let ipV4: string | null = null;
        let ipV6: string | null = null;
        if (this.hasIpCondition(account)) {
            ipV4 = await this.getIpV4();
            ipV6 = await this.getIpV6();
        }

        let matchedStatusAutomation: StatusAutomation | null = null;
        for (const statusAutomation of account.statusAutomations) {
            if (this.matchStatusAutomation(statusAutomation, wifiList, ipV4, ipV6)) {
                matchedStatusAutomation = statusAutomation;
                break;
            }
        }
        const nextStatus = matchedStatusAutomation?.status ?? account.defaultStatus;
        if (
            this.currentStatus == null ||
            this.currentStatus.emoji?.key != nextStatus.emoji?.key ||
            this.currentStatus.message != nextStatus.message
        ) {
            const client = createSlackClient(account.token);
            let status;
            if (nextStatus.emoji != null) {
                status = { status_text: nextStatus.message, status_emoji: `:${nextStatus.emoji.key}:` };
            } else {
                status = { status_text: nextStatus.message };
            }
            try {
                await client.users.profile.set({ profile: JSON.stringify(status) });
                this.accountLog(
                    `change status: message: ${nextStatus.message}, emoji: ${nextStatus.emoji?.key}`,
                    account
                );
            } catch (error) {
                this.applicationLog("fail status change");
            }
        }
        this.currentStatus = nextStatus;
    }

    matchStatusAutomation(
        statusAutomation: StatusAutomation,
        wifiList: string[],
        ipV4: string | null,
        ipV6: string | null
    ): boolean {
        for (const condition of statusAutomation.conditionGroup.conditions) {
            if (condition.__typename == "WifiCondition") {
                if (wifiList.includes(condition.wifi)) {
                    return true;
                }
            }
            if (condition.__typename == "IpCondition") {
                if (condition.ip == ipV4 || condition.ip == ipV6) {
                    return true;
                }
            }
        }
        return false;
    }

    hasWifiCondition(account: Account): boolean {
        for (const statusAutomation of account.statusAutomations) {
            for (const condition of statusAutomation.conditionGroup.conditions) {
                if (condition.__typename == "WifiCondition") {
                    return true;
                }
            }
        }
        return false;
    }

    hasIpCondition(account: Account): boolean {
        for (const statusAutomation of account.statusAutomations) {
            for (const condition of statusAutomation.conditionGroup.conditions) {
                if (condition.__typename == "IpCondition") {
                    return true;
                }
            }
        }
        return false;
    }

    async getCurrentWifi(): Promise<string[]> {
        try {
            const connections = await wifi.getCurrentConnections();
            return connections.map((x: { ssid: string }) => x.ssid);
        } catch (error) {
            this.applicationLog("fail wifi scan");
            return [];
        }
    }

    async getIpV4(): Promise<string | null> {
        try {
            return await v4();
        } catch (error) {
            this.applicationLog("fail ip v4 scan");
            return null;
        }
    }

    async getIpV6(): Promise<string | null> {
        try {
            return await v6();
        } catch (error) {
            this.applicationLog("fail ip v6 scan");
            return null;
        }
    }
}
