import { Account } from "src/app/entities";

export { enAccountTranslate } from "./account.translate.en";
export { jaAccountTranslate } from "./account.translate.ja";

export interface AccountTranslate {
    title: string;
    currentAccount: (account: Account | null) => string;
    accountList: string;
    accountListHelp: string;
}
