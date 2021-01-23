import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { StoreService } from "src/app/services/store.service";
import { Account } from "../../entities";
import { AccountDeleteModalComponent } from "../account-delete-modal/account-delete-modal.component";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.scss"],
})
export class AccountComponent {
    public accounts: Account[] = [];
    public currentAccount: Account | null = null;

    constructor(
        private readonly storeService: StoreService,
        private readonly router: Router,
        private readonly modalService: NgbModal
    ) {
        this.storeService.getAccounts().then((accounts) => {
            this.accounts = accounts;
        });
        this.storeService.getCurrentAccount().then((account) => {
            if (account == null) {
                throw Error();
            }
            this.currentAccount = account;
        });
    }

    addAccount() {
        this.router.navigateByUrl("oauth");
    }

    async removeAccount(index: number) {
        if (index < 0 || this.accounts.length <= index) {
            return;
        }
        const removeAccount = this.accounts[index];
        const modalRef = this.modalService.open(AccountDeleteModalComponent);
        (modalRef.componentInstance as AccountDeleteModalComponent).account = removeAccount;
        await modalRef.result;
        await this.storeService.removeAccount(removeAccount.userId, removeAccount.teamId);
        this.accounts = await this.storeService.getAccounts();
        if (0 < this.accounts.length) {
            this.currentAccount = await this.storeService.getCurrentAccount();
        } else {
            this.router.navigateByUrl("oauth");
        }
    }

    async setCurrentAccount(index: number) {
        if (index < 0 || this.accounts.length <= index) {
            return;
        }
        await this.storeService.setCurrentAccount(this.accounts[index].userId, this.accounts[index].teamId);
        this.currentAccount = await this.storeService.getCurrentAccount();
    }
}
