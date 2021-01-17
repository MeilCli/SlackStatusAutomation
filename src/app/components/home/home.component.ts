import { Component } from "@angular/core";
import { StoreService } from "src/app/services/store.service";
import {
    Account,
    Status,
    StatusAutomation,
    Emoji,
    ConditionGroup,
    EditableConditionGroup,
    EditableCondition,
} from "../../entities";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HomeAddModalComponent } from "../home-add-modal/home-add-modal.component";
import { HomeEditModalComponent } from "../home-edit-modal/home-edit-modal.component";
import { AutomationService } from "src/app/services/automation.service";
import { HomeTranslate } from "./home.translate";
import { TranslateService } from "src/app/services/translate.service";

interface CustomEmoji {
    id: string;
    name: string;
    shortNames: string[];
    text: "";
    emoticons: [];
    keywords: string[];
    imageUrl: string | undefined;
}

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
    private _automationEnabled = false;
    set automationEnabled(value: boolean) {
        this._automationEnabled = value;
        this.storeService.updateAutomationEnabled(this.account.userId, this.account.teamId, value);
        this.automationService.updateAccount();
    }
    get automationEnabled(): boolean {
        return this._automationEnabled;
    }

    private _intervalSeconds: number | null = 0;
    set intervalSeconds(value: number | null) {
        this._intervalSeconds = value;
        if (value != null && 30 <= value) {
            this.storeService.updateIntervalSeconds(this.account.userId, this.account.teamId, value);
            this.automationService.updateAccount();
        }
    }
    get intervalSeconds(): number | null {
        return this._intervalSeconds;
    }

    public account: Account;
    public defaultStatus: Status;
    public statusAutomations: StatusAutomation[] = [];
    public homeTranslate: HomeTranslate;

    constructor(
        private readonly storeService: StoreService,
        private readonly automationService: AutomationService,
        private readonly translateService: TranslateService,
        private readonly modalService: NgbModal
    ) {
        this.account = storeService.getAccounts()[0];
        this._automationEnabled = this.account.automationEnabled;
        this._intervalSeconds = this.account.intervalSeconds;
        this.statusAutomations = this.account.statusAutomations;
        this.defaultStatus = this.account.defaultStatus;
        this.homeTranslate = this.translateService.getAppTranslate().homeTranslate;
    }

    onDefaultStatusChanged(event: Status) {
        this.defaultStatus = event;
        this.storeService.updateDefaultStatus(this.account.userId, this.account.teamId, this.defaultStatus);
        this.automationService.updateAccount();
    }

    onStatusAutomationChanged() {
        this.storeService.updateStatusAutomations(this.account.userId, this.account.teamId, this.statusAutomations);
        this.automationService.updateAccount();
    }

    onStatusAutomationStatusChanged(event: Status, index: number) {
        this.statusAutomations[index].status = event;
        this.onStatusAutomationChanged();
    }

    onStatusAutomationRemoveClicked(index: number) {
        this.statusAutomations = this.statusAutomations.filter((x, i) => i != index);
        this.onStatusAutomationChanged();
    }

    async openAddStatusAutomationModal() {
        const modalRef = this.modalService.open(HomeAddModalComponent);
        const result = (await modalRef.result) as ConditionGroup;
        this.statusAutomations.push({
            conditionGroup: result,
            status: { emoji: null, message: "" },
        });
        this.onStatusAutomationChanged();
    }

    async openEditStatusAutomationModal(index: number) {
        const conditionGroup = this.statusAutomations[index].conditionGroup;
        const editableConditionGroup: EditableConditionGroup = {
            name: conditionGroup.name,
            conditions: conditionGroup.conditions.map((x) => {
                if (x.__typename == "IpCondition") {
                    return { type: "Ip", value: x.ip } as EditableCondition;
                } else {
                    return { type: "Wifi", value: x.wifi } as EditableCondition;
                }
            }),
        };
        const modalRef = this.modalService.open(HomeEditModalComponent);
        (modalRef.componentInstance as HomeEditModalComponent).editableConditionGroup = editableConditionGroup;
        const result = (await modalRef.result) as ConditionGroup;
        this.statusAutomations[index].conditionGroup = result;
        this.onStatusAutomationChanged();
    }
}
