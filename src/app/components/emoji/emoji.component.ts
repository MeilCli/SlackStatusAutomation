import { Component } from "@angular/core";
import { SlackService } from "src/app/services/slack.service";
import { StoreService } from "src/app/services/store.service";
import { TranslateService } from "src/app/services/translate.service";
import { Account, Emoji, EmojiAlias } from "../../entities";
import { EmojiTranslate } from "./emoji.translate";

interface CustomEmoji {
    id: string;
    name: string;
    shortNames: string[];
    text: "";
    emoticons: [];
    keywords: string[];
    imageUrl: string | undefined;
}

@Component({
    selector: "app-emoji",
    templateUrl: "./emoji.component.html",
    styleUrls: ["./emoji.component.scss"],
})
export class EmojiComponent {
    private account: Account | null = null;

    public syncMessage = "";
    public customEmojis: CustomEmoji[] = [];
    public emojiTranslate: EmojiTranslate;

    constructor(
        private readonly storeService: StoreService,
        private readonly translateService: TranslateService,
        private readonly slackService: SlackService
    ) {
        this.storeService.getCurrentAccount().then((account) => {
            if (account == null) {
                throw Error();
            }
            this.account = account;
            this.updateCustomEmojis();
        });
        this.emojiTranslate = this.translateService.getDefaultAppTranslate().emojiTranslate;
        this.translateService.getAppTranslate().then((value) => {
            this.emojiTranslate = value.emojiTranslate;
        });
    }

    async onclickSyncCustomEmoji() {
        if (this.account == null) {
            return;
        }

        const emojiListResponse = await this.slackService.emojiList(this.account.token);
        const entities = emojiListResponse.emoji;
        const result: (Emoji | EmojiAlias)[] = [];
        for (const key in entities) {
            const target = entities[key];
            if (target.startsWith("http")) {
                result.push({ __typename: "Emoji", key: key, image: target } as Emoji);
            }
        }
        for (const key in entities) {
            const target = entities[key];
            if (target.startsWith("alias:")) {
                const targetKey = target.slice("alias:".length, target.length);
                const found = result.find((x) => x.key == targetKey);
                result.push({
                    __typename: "EmojiAlias",
                    key: key,
                    ailias: { key: targetKey, image: found?.__typename == "Emoji" ? found.image : null },
                } as EmojiAlias);
            }
        }
        this.account.emojiList = result;
        await this.storeService.updateEmojiList(this.account.userId, this.account.teamId, result);

        this.syncMessage = this.emojiTranslate.scynedCustomEmoji(result.length);
        this.updateCustomEmojis();
    }

    updateCustomEmojis() {
        if (this.account == null) {
            return;
        }

        const newList: CustomEmoji[] = [];
        for (const emoji of this.account.emojiList) {
            if (emoji.__typename == "Emoji") {
                newList.push({
                    id: emoji.key,
                    name: emoji.key,
                    shortNames: [emoji.key],
                    keywords: [emoji.key],
                    text: "",
                    emoticons: [],
                    imageUrl: emoji.image ?? undefined,
                });
            }
            if (emoji.__typename == "EmojiAlias") {
                newList.push({
                    id: emoji.key,
                    name: emoji.key,
                    shortNames: [emoji.key],
                    keywords: [emoji.key],
                    text: "",
                    emoticons: [],
                    imageUrl: emoji.ailias.image ?? undefined,
                });
            }
        }
        this.customEmojis = newList;
    }
}
