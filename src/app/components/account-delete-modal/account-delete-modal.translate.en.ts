import { Account } from "src/app/entities";
import { AccountDeleteModalTranslate } from "./account-delete-modal.translate";

export const enAccountDeleteModalTranslate: AccountDeleteModalTranslate = {
    title: "Delete account",
    message1: (account: Account | null) => `Delete ${account?.teamName}/${account?.userName}?`,
    message2: "If delete account, will delete automation settings",
    delete: "Delete",
};
