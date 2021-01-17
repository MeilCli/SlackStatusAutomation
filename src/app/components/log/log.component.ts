import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { LoggerService } from "src/app/services/logger.service";

@Component({
    selector: "app-log",
    templateUrl: "./log.component.html",
    styleUrls: ["./log.component.scss"],
})
export class LogComponent implements OnInit, OnDestroy {
    private logSubscription: Subscription | null = null;

    public logs: string[] = [];

    constructor(private readonly loggerService: LoggerService, private readonly zone: NgZone) {}

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
