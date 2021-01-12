import { Injectable } from "@angular/core";
import { Account, Status, StatusAutomation } from "../entities";
import { setInterval, clearInterval } from "timers";
import { Observable, Subject } from "rxjs";
import { StoreService } from "./store.service";
import { createSlackClient } from "../slack";
import { v4, v6 } from "public-ip";
const wifi = require("node-wifi");

@Injectable({
    providedIn: "root",
})
export class AutomationService {
    private readonly logger = new Logger();
    private timers: AccountTimer[] = [];

    constructor(private readonly storeService: StoreService) {}

    getLogs(): string[] {
        return this.logger.getLogs();
    }

    getLogObservable(): Observable<string> {
        return this.logger.getLogObservable();
    }

    startApplication() {
        wifi.init({ iface: null });
        if (0 < this.timers.length) {
            this.updateAccount();
            return;
        }
        const accounts = this.storeService.getAccounts();
        for (const account of accounts) {
            const timer = new AccountTimer(this.logger, account.userId, account.teamId);
            this.timers.push(timer);
            timer.start(account);
        }
    }

    updateAccount() {
        const accounts = this.storeService.getAccounts();
        if (accounts.length == 0) {
            // accounts cleard
            // store service support clear or add operation now
            for (const timer of this.timers) {
                timer.forceStop();
            }
            this.timers = [];
            return;
        }

        for (const account of accounts) {
            const foundTimer = this.timers.find((x) => x.userId == account.userId && x.teamId == account.teamId);
            if (foundTimer != null) {
                foundTimer.update(account);
            } else {
                const newTimer = new AccountTimer(this.logger, account.userId, account.teamId);
                this.timers.push(newTimer);
            }
        }
    }
}

class Logger {
    private logs: string[] = [];
    private subject: Subject<string> = new Subject<string>();

    applicationLog(value: string) {
        const date = new Date().toLocaleString();
        const log = `${date}# application: ${value}`;
        this.logs.push(log);
        this.subject.next(log);
    }

    accountLog(value: string, account: Account) {
        const date = new Date().toLocaleString();
        const log = `${date}# ${account.teamName}:${account.userName}: ${value}`;
        this.logs.push(log);
        this.subject.next(log);
    }

    getLogs(): string[] {
        return this.logs.map((x) => x);
    }

    getLogObservable(): Observable<string> {
        return this.subject;
    }
}

class AccountTimer {
    private timerId: NodeJS.Timeout | null = null;
    private cachedAccount: Account | null = null;
    private currentStatus: Status | null = null;

    constructor(private readonly logger: Logger, public readonly userId: string, public readonly teamId: string) {}

    start(account: Account) {
        this.cachedAccount = account;
        if (account.automationEnabled) {
            this.timerId = setInterval(() => {
                this.handle(account);
            }, account.intervalSeconds * 1000);
            this.logger.accountLog("start timer", account);
        }
    }

    update(account: Account) {
        this.cachedAccount = account;
        if (this.timerId != null) {
            clearInterval(this.timerId);
            this.logger.accountLog("stop timer", account);
            this.timerId = null;
        }
        if (account.automationEnabled) {
            this.timerId = setInterval(() => {
                this.handle(account);
            }, account.intervalSeconds * 1000);
            this.logger.accountLog("update start timer", account);
        }
    }

    forceStop() {
        if (this.timerId != null) {
            clearInterval(this.timerId);
            if (this.cachedAccount != null) {
                this.logger.accountLog("stop timer", this.cachedAccount);
            } else {
                this.logger.applicationLog("stop unknown timer");
            }
            this.timerId = null;
        }
    }

    async handle(account: Account) {
        this.logger.accountLog("handle timer", account);
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
                this.logger.accountLog(
                    `change status: message: ${nextStatus.message}, emoji: ${nextStatus.emoji?.key}`,
                    account
                );
            } catch (error) {
                this.logger.applicationLog("fail status change");
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
            this.logger.applicationLog("fail wifi scan");
            return [];
        }
    }

    async getIpV4(): Promise<string | null> {
        try {
            return await v4();
        } catch (error) {
            this.logger.applicationLog("fail ip v4 scan");
            return null;
        }
    }

    async getIpV6(): Promise<string | null> {
        try {
            return await v6();
        } catch (error) {
            this.logger.applicationLog("fail ip v6 scan");
            return null;
        }
    }
}
