import { Component } from "@angular/core";
import { shell } from "electron";

@Component({
    selector: "app-about",
    templateUrl: "./about.component.html",
    styleUrls: ["./about.component.scss"],
})
export class AboutComponent {
    public libraries = [
        {
            name: "Angular",
            url: "https://github.com/angular/angular",
            license: "MIT License",
            licenseUrl: "https://github.com/angular/angular/blob/master/LICENSE",
        },
        {
            name: "Official components for Angular",
            url: "https://github.com/angular/components",
            license: "MIT License",
            licenseUrl: "https://github.com/angular/components/blob/master/LICENSE",
        },
        {
            name: "ngx-emoji-mart",
            url: "https://github.com/scttcper/ngx-emoji-mart",
            license: "MIT License",
            licenseUrl: "https://github.com/scttcper/ngx-emoji-mart/blob/master/LICENSE",
        },
        {
            name: "ng-bootstrap",
            url: "https://github.com/ng-bootstrap/ng-bootstrap",
            license: "MIT License",
            licenseUrl: "https://github.com/ng-bootstrap/ng-bootstrap/blob/master/LICENSE",
        },
        {
            name: "node-slack-sdk",
            url: "https://github.com/slackapi/node-slack-sdk",
            license: "MIT License",
            licenseUrl: "https://github.com/slackapi/node-slack-sdk/blob/main/LICENSE",
        },
        {
            name: "bootstrap",
            url: "https://github.com/twbs/bootstrap",
            license: "MIT License",
            licenseUrl: "https://github.com/twbs/bootstrap/blob/main/LICENSE",
        },
        {
            name: "electron",
            url: "https://github.com/electron/electron",
            license: "MIT License",
            licenseUrl: "https://github.com/electron/electron/blob/master/LICENSE",
        },
        {
            name: "electron-store",
            url: "https://github.com/sindresorhus/electron-store",
            license: "MIT License",
            licenseUrl: "https://github.com/sindresorhus/electron-store/blob/master/license",
        },
        {
            name: "electron-builder",
            url: "https://github.com/electron-userland/electron-builder",
            license: "MIT License",
            licenseUrl: "https://github.com/electron-userland/electron-builder/blob/master/LICENSE",
        },
        {
            name: "express",
            url: "https://github.com/expressjs/express",
            license: "MIT License",
            licenseUrl: "https://github.com/expressjs/express/blob/master/LICENSE",
        },
        {
            name: "menubar",
            url: "https://github.com/maxogden/menubar",
            license: "BSD-2-Clause License",
            licenseUrl: "https://github.com/maxogden/menubar/blob/master/LICENSE",
        },
        {
            name: "node-wifi",
            url: "https://github.com/friedrith/node-wifi",
            license: "MIT License",
            licenseUrl: "https://github.com/friedrith/node-wifi/blob/master/LICENSE",
        },
        {
            name: "public-ip",
            url: "https://github.com/sindresorhus/public-ip",
            license: "MIT License",
            licenseUrl: "https://github.com/sindresorhus/public-ip/blob/master/license",
        },
        {
            name: "rxjs",
            url: "https://github.com/reactivex/rxjs",
            license: "Apache-2.0 License",
            licenseUrl: "https://github.com/ReactiveX/rxjs/blob/master/LICENSE.txt",
        },
        {
            name: "tslib",
            url: "https://github.com/Microsoft/tslib",
            license: "BSD-0-Clause License",
            licenseUrl: "https://github.com/microsoft/tslib/blob/master/LICENSE.txt",
        },
        // zone.js is same library to angular
    ];

    openExternalBrowser(url: string) {
        shell.openExternal(url);
    }
}
