import { Account } from "src/app/entities";

export { enAccountDeleteModalTranslate } from "./account-delete-modal.translate.en";
export { jaAccountDeleteModalTranslate } from "./account-delete-modal.translate.ja";

export interface AccountDeleteModalTranslate {
    title: string;
    message1: (account: Account | null) => string;
    message2: string;
    delete: string;
}
