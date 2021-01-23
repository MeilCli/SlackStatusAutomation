import { AccountTranslate } from "./account.translate";
import { Account } from "../../entities";

export const jaAccountTranslate: AccountTranslate = {
    title: "アカウント",
    currentAccount: (account: Account | null) => `現在のアカウント: ${account?.teamName}/${account?.userName}`,
    accountList: "アカウント一覧",
    accountListHelp:
        "ホームと絵文字はアカウントごとに存在します。そのためオートメーションの設定はアカウントごとにする必要があります",
};
