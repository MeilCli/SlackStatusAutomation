import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EditableConditionGroup } from "../../entities";

@Component({
    selector: "app-home-delete-modal",
    templateUrl: "./home-delete-modal.component.html",
    styleUrls: ["./home-delete-modal.component.scss"],
})
export class HomeDeleteModalComponent {
    @Input()
    public editableConditionGroup: EditableConditionGroup = { name: "", conditions: [{ type: "Ip", value: "" }] };

    constructor(public activeModal: NgbActiveModal) {}
}
