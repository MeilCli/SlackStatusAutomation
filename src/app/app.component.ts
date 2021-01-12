import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AutomationService } from "./services/automation.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
    constructor(private readonly router: Router, private readonly automationService: AutomationService) {}

    ngOnInit(): void {
        this.automationService.startApplication();
        this.router.navigateByUrl("");
    }
}
