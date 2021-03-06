import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StoreService } from "src/app/services/store.service";

@Component({
    selector: "app-index",
    templateUrl: "./index.component.html",
    styleUrls: ["./index.component.scss"],
})
export class IndexComponent implements OnInit {
    constructor(private router: Router, private storeService: StoreService) {}

    ngOnInit(): void {
        this.storeService.getCurrentAccount().then((account) => {
            if (account != null) {
                this.router.navigateByUrl("/home");
            } else {
                this.router.navigateByUrl("/oauth");
            }
        });
    }
}
