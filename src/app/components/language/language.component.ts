import { Component } from "@angular/core";
import { TranslateService } from "src/app/services/translate.service";
import { HeaderTranslate } from "../header/header.translate";
import { LanguageTranslate } from "./language.translate";

interface Language {
    name: string;
    value: "en" | "ja";
}

@Component({
    selector: "app-language",
    templateUrl: "./language.component.html",
    styleUrls: ["./language.component.scss"],
})
export class LanguageComponent {
    public languages: Language[] = [
        { name: "English", value: "en" },
        { name: "日本語", value: "ja" },
    ];
    public languageTranslate: LanguageTranslate;
    public headerTranslate: HeaderTranslate;

    constructor(private readonly translateService: TranslateService) {
        const appTranslate = this.translateService.getAppTranslate();
        this.languageTranslate = appTranslate.languageTranslate;
        this.headerTranslate = appTranslate.headerTranslate;
    }

    onLanguageClicked(value: "en" | "ja") {
        this.translateService.changeTranslate(value);
        const appTranslate = this.translateService.getAppTranslate();
        this.languageTranslate = appTranslate.languageTranslate;
        this.headerTranslate = appTranslate.headerTranslate;
    }
}
