import { Injectable } from "@angular/core";
import { AppTranslate, enAppTranslate, jaAppTranslate } from "../app.translate";

@Injectable({
    providedIn: "root",
})
export class TranslateService {
    getAppTranslate(): AppTranslate {
        console.log(`navigator language: ${navigator.language}`);
        switch (navigator.language) {
            case "ja":
                return jaAppTranslate;
            default:
                return enAppTranslate;
        }
    }
}
