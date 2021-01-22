import { Injectable } from "@angular/core";
import { AuthTest, EmojiList, OauthV2Access, SlackApi } from "src/slack";

declare global {
    interface Window {
        slack: SlackApi;
    }
}

@Injectable({
    providedIn: "root",
})
export class SlackService {
    async oauthV2Access(
        code: string,
        clientId: string,
        clientSecret: string,
        redirectUri: string
    ): Promise<OauthV2Access> {
        return await window.slack.oauthV2Access(code, clientId, clientSecret, redirectUri);
    }

    async authTest(token: string): Promise<AuthTest> {
        return await window.slack.authTest(token);
    }

    async emojiList(token: string): Promise<EmojiList> {
        return await window.slack.emojiList(token);
    }
}
