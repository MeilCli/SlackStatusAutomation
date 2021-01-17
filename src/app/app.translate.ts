import { HomeTranslate, enHomeTranslate, jaHomeTranslate } from "./components/home/home.translate";
import { StatusTranslate, enStatusTranslate, jaStatusTranslate } from "./components/status/status.translate";
import { LanguageTranslate, enLanguageTranslate, jaLanguageTranslate } from "./components/language/language.translate";
import { HeaderTranslate, enHeaderTranslate, jaHeaderTranslate } from "./components/header/header.translate";

export interface AppTranslate {
    homeTranslate: HomeTranslate;
    statusTranslate: StatusTranslate;
    languageTranslate: LanguageTranslate;
    headerTranslate: HeaderTranslate;
}

export const enAppTranslate: AppTranslate = {
    homeTranslate: enHomeTranslate,
    statusTranslate: enStatusTranslate,
    languageTranslate: enLanguageTranslate,
    headerTranslate: enHeaderTranslate,
};
export const jaAppTranslate: AppTranslate = {
    homeTranslate: jaHomeTranslate,
    statusTranslate: jaStatusTranslate,
    languageTranslate: jaLanguageTranslate,
    headerTranslate: jaHeaderTranslate,
};
