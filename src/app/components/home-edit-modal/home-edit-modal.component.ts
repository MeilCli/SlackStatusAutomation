import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "src/app/services/translate.service";
import { EditableConditionGroup, ConditionGroup, IpCondition, WifiCondition } from "../../entities";
import { HomeEditModalTranslate } from "./home-edit-modal.translate";

@Component({
    selector: "app-home-edit-modal",
    templateUrl: "./home-edit-modal.component.html",
    styleUrls: ["./home-edit-modal.component.scss"],
})
export class HomeEditModalComponent {
    @Input()
    public editableConditionGroup: EditableConditionGroup = { name: "", conditions: [{ type: "Ip", value: "" }] };

    public homeEditModalTranslate: HomeEditModalTranslate;

    constructor(public activeModal: NgbActiveModal, private readonly translateService: TranslateService) {
        this.homeEditModalTranslate = this.translateService.getAppTranslate().homeEditModalTranslate;
    }

    addEditableCondition() {
        this.editableConditionGroup.conditions.push({ type: "Ip", value: "" });
    }

    removeEditableCondition(index: number) {
        const newEditableConditionGroup = this.editableConditionGroup;
        newEditableConditionGroup.conditions = newEditableConditionGroup.conditions.filter((x, i) => index != i);
        this.editableConditionGroup = newEditableConditionGroup;
    }

    result(): ConditionGroup {
        return {
            name: this.editableConditionGroup.name,
            conditions: this.editableConditionGroup.conditions.map((x) => {
                if (x.type == "Ip") {
                    return { __typename: "IpCondition", ip: x.value } as IpCondition;
                } else {
                    return { __typename: "WifiCondition", wifi: x.value } as WifiCondition;
                }
            }),
        };
    }
}
