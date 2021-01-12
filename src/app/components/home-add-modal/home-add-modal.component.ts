import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EditableConditionGroup, ConditionGroup, IpCondition, WifiCondition } from "../../entities";

@Component({
    selector: "app-home-add-modal",
    templateUrl: "./home-add-modal.component.html",
    styleUrls: ["./home-add-modal.component.scss"],
})
export class HomeAddModalComponent {
    public editableConditionGroup: EditableConditionGroup = { name: "", conditions: [{ type: "Ip", value: "" }] };

    constructor(public activeModal: NgbActiveModal) {}

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
