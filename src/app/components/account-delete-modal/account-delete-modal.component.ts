import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Account } from "src/app/entities";

@Component({
    selector: "app-account-delete-modal",
    templateUrl: "./account-delete-modal.component.html",
    styleUrls: ["./account-delete-modal.component.scss"],
})
export class AccountDeleteModalComponent {
    @Input()
    public account: Account | null = null;

    constructor(public activeModal: NgbActiveModal) {}
}
