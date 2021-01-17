import { Injectable } from "@angular/core";
import { AppTranslate, enAppTranslate, jaAppTranslate } from "../app.translate";
import { StoreService } from "./store.service";

@Injectable({
    providedIn: "root",
})
export class TranslateService {
    constructor(private readonly storeService: StoreService) {}

    getAppTranslate(): AppTranslate {
        switch (this.storeService.getLanguage()) {
            case "ja":
                return jaAppTranslate;
            default:
                return enAppTranslate;
        }
    }

    changeTranslate(value: "en" | "ja") {
        this.storeService.setLanguage(value);
    }
}
