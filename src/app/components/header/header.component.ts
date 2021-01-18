import { Component, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "src/app/services/translate.service";
import { HeaderTranslate } from "./header.translate";

interface Link {
    title: string;
    path: string;
}

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
    private _headerTranslate: HeaderTranslate;
    @Input()
    set headerTranslate(value: HeaderTranslate) {
        this._headerTranslate = value;
        this.createLink();
    }
    get headerTranslate(): HeaderTranslate {
        return this._headerTranslate;
    }

    public links: Link[] = [];
    public otherLinks: Link[] = [];
    public activePath: string;

    constructor(route: ActivatedRoute, private readonly translateService: TranslateService) {
        this.activePath = route.snapshot.url.map((x) => x.path).join("/");
        this._headerTranslate = this.translateService.getAppTranslate().headerTranslate;
        this.createLink();
    }

    createLink() {
        this.links = [
            { title: this.headerTranslate.home, path: "home" },
            { title: this.headerTranslate.emoji, path: "emoji" },
            { title: this.headerTranslate.account, path: "account" },
            { title: this.headerTranslate.language, path: "language" },
        ];
        this.otherLinks = [
            { title: this.headerTranslate.log, path: "log" },
            { title: this.headerTranslate.about, path: "about" },
        ];
    }
}
