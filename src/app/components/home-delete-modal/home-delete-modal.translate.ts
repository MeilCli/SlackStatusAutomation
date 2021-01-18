export { enHomeDeleteModalTranslate } from "./home-delete-modal.translate.en";
export { jaHomeDeleteModalTranslate } from "./home-delete-modal.translate.ja";

export interface HomeDeleteModalTranslate {
    title: string;
    message: (name: string) => string;
    delete: string;
}
