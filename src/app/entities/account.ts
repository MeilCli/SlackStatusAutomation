import { Emoji, EmojiAlias } from "./emoji";
import { StatusAutomation } from "./status-automation";
import { Status } from "./status";

export interface Account {
    token: string;
    userId: string;
    userName: string;
    teamId: string;
    teamName: string;
    intervalSeconds: number;
    automationEnabled: boolean;
    emojiList: (Emoji | EmojiAlias)[];
    statusAutomations: StatusAutomation[];
    defaultStatus: Status;
}
