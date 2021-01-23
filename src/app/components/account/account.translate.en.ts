import { AccountTranslate } from "./account.translate";
import { Account } from "../../entities";

export const enAccountTranslate: AccountTranslate = {
    title: "Account",
    currentAccount: (account: Account | null) => `Current account: ${account?.teamName}/${account?.userName}`,
    accountList: "Account List",
    accountListHelp:
        "Home and Emoji exist for each account. Therefore, Automation settings must be set for each account.",
};
