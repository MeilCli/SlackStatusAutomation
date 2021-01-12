import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { AutomationService } from "src/app/services/automation.service";

@Component({
    selector: "app-log",
    templateUrl: "./log.component.html",
    styleUrls: ["./log.component.scss"],
})
export class LogComponent implements OnInit, OnDestroy {
    private logSubscription: Subscription | null = null;

    public logs: string[] = [];

    constructor(private readonly automationService: AutomationService, private readonly zone: NgZone) {}

    ngOnInit() {
        this.logs = this.automationService.getLogs();
        this.logSubscription = this.automationService.getLogObservable().subscribe((log) => {
            this.zone.run(() => {
                this.logs.push(log);
            });
        });
    }

    ngOnDestroy() {
        this.logSubscription?.unsubscribe();
    }
}
