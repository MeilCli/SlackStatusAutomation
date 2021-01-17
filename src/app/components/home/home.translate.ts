export { enHomeTranslate } from "./home.translate.en";
export { jaHomeTranslate } from "./home.translate.ja";

export interface HomeTranslate {
    title: string;
    automationState: (enabled: boolean) => string;
    on: string;
    off: string;
    intervalSeconds: string;
    automationTitle: string;
    automationHelp: string;
    defaultStatusTitle: string;
}
