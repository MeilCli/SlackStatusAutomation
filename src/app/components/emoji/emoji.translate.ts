export { enEmojiTranslate } from "./emoji.translate.en";
export { jaEmojiTranslate } from "./emoji.translate.ja";

export interface EmojiTranslate {
    title: string;
    syncCustomEmoji: string;
    scynedCustomEmoji: (count: number) => string;
    usefulEmoji: string;
}
