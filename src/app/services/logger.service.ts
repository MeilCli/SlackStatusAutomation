import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { LoggerApi } from "src/logger";

declare global {
    interface Window {
        logger: LoggerApi;
    }
}

@Injectable({
    providedIn: "root",
})
export class LoggerService {
    private subject: Subject<string> = new Subject<string>();

    startApplication() {
        window.logger.logged((log) => {
            this.subject.next(log);
        });
    }

    log(value: string) {
        const date = new Date().toLocaleString();
        window.logger.new(`${date}# ${value}`);
    }

    getLogObservable(): Observable<string> {
        return this.subject;
    }

    async getLogs(): Promise<string[]> {
        return await window.logger.get();
    }
}
