import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "src/app/services/translate.service";
import { EditableConditionGroup } from "../../entities";
import { HomeDeleteModalTranslate } from "./home-delete-modal.translate";

@Component({
    selector: "app-home-delete-modal",
    templateUrl: "./home-delete-modal.component.html",
    styleUrls: ["./home-delete-modal.component.scss"],
})
export class HomeDeleteModalComponent {
    @Input()
    public editableConditionGroup: EditableConditionGroup = { name: "", conditions: [{ type: "Ip", value: "" }] };

    public homeDeleteModalTranslate: HomeDeleteModalTranslate;

    constructor(public activeModal: NgbActiveModal, private readonly translateService: TranslateService) {
        this.homeDeleteModalTranslate = this.translateService.getAppTranslate().homeDeleteModalTranslate;
    }
}
