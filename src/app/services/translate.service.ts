import { Injectable } from "@angular/core";
import { AppTranslate, enAppTranslate, jaAppTranslate } from "../app.translate";
import { StoreService } from "./store.service";

@Injectable({
    providedIn: "root",
})
export class TranslateService {
    private cachedAppTranslate: AppTranslate | null = null;

    constructor(private readonly storeService: StoreService) {}

    getDefaultAppTranslate(): AppTranslate {
        const result = this.cachedAppTranslate ?? enAppTranslate;
        if (this.cachedAppTranslate == null) {
            this.getAppTranslate().then((value) => {
                this.cachedAppTranslate = value;
            });
        }
        return result;
    }

    async getAppTranslate(): Promise<AppTranslate> {
        switch (await this.storeService.getLanguage()) {
            case "ja":
                return jaAppTranslate;
            default:
                return enAppTranslate;
        }
    }

    async changeTranslate(value: "en" | "ja") {
        await this.storeService.setLanguage(value);
        this.cachedAppTranslate = await this.getAppTranslate();
    }
}
