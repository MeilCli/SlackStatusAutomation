import { Emoji } from "./eoji";

export interface EmojiAlias {
    __typename: "EmojiAlias";
    key: string;
    ailias: Emoji;
}
