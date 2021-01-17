import { HomeTranslate, enHomeTranslate, jaHomeTranslate } from "./components/home/home.translate";

export interface AppTranslate {
    homeTranslate: HomeTranslate;
}

export const enAppTranslate: AppTranslate = {
    homeTranslate: enHomeTranslate,
};
export const jaAppTranslate: AppTranslate = {
    homeTranslate: jaHomeTranslate,
};
