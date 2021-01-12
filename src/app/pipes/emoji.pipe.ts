import { Pipe, PipeTransform } from "@angular/core";
import { Emoji, EmojiAlias } from "../entities";
import { EmojiData } from "@ctrl/ngx-emoji-mart/ngx-emoji/data/data.interfaces";

@Pipe({
    name: "emoji",
})
export class EmojiPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(value: Emoji | EmojiAlias | null, ...args: unknown[]): string | EmojiData | null {
        if (value == null) {
            return null;
        }
        if (value.__typename == "Emoji") {
            if (value.image == null) {
                return value.key;
            }
            return {
                id: value.key,
                name: value.key,
                shortName: value.key,
                shortNames: [value.key],
                text: "",
                keywords: [value.key],
                emoticons: [],
                skinVariations: [],
                sheet: [0, 0],
                hidden: [],
                imageUrl: value.image ?? undefined,
            };
        }
        if (value.ailias.image == null) {
            return value.ailias.key;
        }
        return {
            id: value.key,
            name: value.key,
            shortName: value.key,
            shortNames: [value.key],
            text: "",
            keywords: [value.key],
            emoticons: [],
            skinVariations: [],
            sheet: [0, 0],
            hidden: [],
            imageUrl: value.ailias.image ?? undefined,
        };
    }
}
