import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { StoreService } from "src/app/services/store.service";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.scss"],
})
export class AccountComponent {
    constructor(private readonly storeService: StoreService, private readonly router: Router) {}

    clearAccounts() {
        this.storeService.clearAccounts();
        this.router.navigateByUrl("oauth");
    }
}
