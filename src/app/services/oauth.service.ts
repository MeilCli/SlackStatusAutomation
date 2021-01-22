import { Injectable } from "@angular/core";
import { OauthApi } from "src/oauth";

declare global {
    interface Window {
        oauth: OauthApi;
    }
}

@Injectable({
    providedIn: "root",
})
export class OauthService {
    start(handler: (code: string) => void) {
        window.oauth.start();
        window.oauth.callback(handler);
    }

    end() {
        window.oauth.end();
        window.oauth.removeCallback();
    }
}
