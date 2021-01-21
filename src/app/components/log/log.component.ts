import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { LoggerService } from "src/app/services/logger.service";
import { TranslateService } from "src/app/services/translate.service";
import { LogTranslate } from "./log.translate";

@Component({
    selector: "app-log",
    templateUrl: "./log.component.html",
    styleUrls: ["./log.component.scss"],
})
export class LogComponent implements OnInit, OnDestroy {
    private logSubscription: Subscription | null = null;

    public logs: string[] = [];
    public logTranslate: LogTranslate;

    constructor(
        private readonly loggerService: LoggerService,
        private readonly translateService: TranslateService,
        private readonly zone: NgZone
    ) {
        this.logTranslate = this.translateService.getDefaultAppTranslate().logTranslate;
        this.translateService.getAppTranslate().then((value) => {
            this.logTranslate = value.logTranslate;
        });
    }

    async ngOnInit() {
        this.logs = await this.loggerService.getLogs();
        this.logSubscription = this.loggerService.getLogObservable().subscribe((log) => {
            this.zone.run(() => {
                this.logs.push(log);
            });
        });
    }

    ngOnDestroy() {
        this.logSubscription?.unsubscribe();
    }
}
