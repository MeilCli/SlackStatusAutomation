import { Component, EventEmitter, Input, Output } from "@angular/core";
import { EmojiEvent } from "@ctrl/ngx-emoji-mart/ngx-emoji";
import { Account, Emoji, Status } from "src/app/entities";

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
    selector: "app-status",
    templateUrl: "./status.component.html",
    styleUrls: ["./status.component.scss"],
})
export class StatusComponent {
    private _account: Account | null = null;
    @Input()
    set account(value: Account | null) {
        this._account = value;
        if (value != null) {
            this.updateCustomEmojis(value);
        }
    }
    get account(): Account | null {
        return this._account;
    }

    @Input()
    status: Status = { emoji: null, message: "" };

    @Output()
    statusChanged = new EventEmitter<Status>();

    public customEmojis: CustomEmoji[] = [];

    constructor() {}

    toggleStatusEmojiPopover(popover: { isOpen: () => boolean; close: () => void; open: () => void }) {
        if (popover.isOpen()) {
            popover.close();
        } else {
            popover.open();
        }
    }

    onStatusEmojiClicked(event: EmojiEvent) {
        if (this.account == null) {
            return;
        }
        const foundCustomEmoji = this.account.emojiList.find((x) => x.key == event.emoji.id);
        this.status.emoji = foundCustomEmoji ?? ({ __typename: "Emoji", key: event.emoji.id, image: null } as Emoji);
        this.onStatusChanged();
    }

    onStatusClearClicked() {
        this.status = { emoji: null, message: "" };
        this.onStatusChanged();
    }

    onStatusChanged() {
        this.statusChanged.emit(this.status);
    }

    updateCustomEmojis(account: Account) {
        const newList: CustomEmoji[] = [];
        for (const emoji of account.emojiList) {
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
