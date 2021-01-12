import { Emoji, EmojiAlias } from "./emoji";

export interface Status {
    emoji: Emoji | EmojiAlias | null;
    message: string;
}
