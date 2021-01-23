import { Account } from "src/app/entities";
import { AccountDeleteModalTranslate } from "./account-delete-modal.translate";

export const jaAccountDeleteModalTranslate: AccountDeleteModalTranslate = {
    title: "アカウントを削除",
    message1: (account: Account | null) => `${account?.teamName}/${account?.userName}を削除しますか？`,
    message2: "アカウントを削除するとオートメーションの設定も削除されます",
    delete: "削除する",
};
