import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Account } from "src/app/entities";
import { TranslateService } from "src/app/services/translate.service";
import { AccountDeleteModalTranslate } from "./account-delete-modal.translate";

@Component({
    selector: "app-account-delete-modal",
    templateUrl: "./account-delete-modal.component.html",
    styleUrls: ["./account-delete-modal.component.scss"],
})
export class AccountDeleteModalComponent {
    @Input()
    public account: Account | null = null;

    public accountDeleteModalTranslate: AccountDeleteModalTranslate;

    constructor(public activeModal: NgbActiveModal, private readonly translateService: TranslateService) {
        this.accountDeleteModalTranslate = this.translateService.getDefaultAppTranslate().accountDeleteModalTranslate;
        this.translateService.getAppTranslate().then((value) => {
            this.accountDeleteModalTranslate = value.accountDeleteModalTranslate;
        });
    }
}
