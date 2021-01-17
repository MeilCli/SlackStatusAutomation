import { HomeTranslate, enHomeTranslate, jaHomeTranslate } from "./components/home/home.translate";
import { StatusTranslate, enStatusTranslate, jaStatusTranslate } from "./components/status/status.translate";

export interface AppTranslate {
    homeTranslate: HomeTranslate;
    statusTranslate: StatusTranslate;
}

export const enAppTranslate: AppTranslate = {
    homeTranslate: enHomeTranslate,
    statusTranslate: enStatusTranslate,
};
export const jaAppTranslate: AppTranslate = {
    homeTranslate: jaHomeTranslate,
    statusTranslate: jaStatusTranslate,
};
