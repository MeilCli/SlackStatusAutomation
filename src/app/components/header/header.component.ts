import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
    public links = [
        { title: "Home", path: "home" },
        { title: "Emoji", path: "emoji" },
        { title: "Account", path: "account" },
        { title: "Log", path: "log" },
        { title: "License", path: "license" },
    ];

    public activePath: string;

    constructor(route: ActivatedRoute) {
        this.activePath = route.snapshot.url.map((x) => x.path).join("/");
    }
}
