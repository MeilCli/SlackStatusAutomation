import { HomeTranslate, enHomeTranslate, jaHomeTranslate } from "./components/home/home.translate";
import {
    HomeAddModalTranslate,
    enHomeAddModalTranslate,
    jaHomeAddModalTranslate,
} from "./components/home-add-modal/home-add-modal.translate";
import { StatusTranslate, enStatusTranslate, jaStatusTranslate } from "./components/status/status.translate";
import { LanguageTranslate, enLanguageTranslate, jaLanguageTranslate } from "./components/language/language.translate";
import { HeaderTranslate, enHeaderTranslate, jaHeaderTranslate } from "./components/header/header.translate";

export interface AppTranslate {
    homeTranslate: HomeTranslate;
    homeAddModalTranslate: HomeAddModalTranslate;
    statusTranslate: StatusTranslate;
    languageTranslate: LanguageTranslate;
    headerTranslate: HeaderTranslate;
}

export const enAppTranslate: AppTranslate = {
    homeTranslate: enHomeTranslate,
    homeAddModalTranslate: enHomeAddModalTranslate,
    statusTranslate: enStatusTranslate,
    languageTranslate: enLanguageTranslate,
    headerTranslate: enHeaderTranslate,
};
export const jaAppTranslate: AppTranslate = {
    homeTranslate: jaHomeTranslate,
    homeAddModalTranslate: jaHomeAddModalTranslate,
    statusTranslate: jaStatusTranslate,
    languageTranslate: jaLanguageTranslate,
    headerTranslate: jaHeaderTranslate,
};
