import { HomeTranslate, enHomeTranslate, jaHomeTranslate } from "./components/home/home.translate";
import {
    HomeAddModalTranslate,
    enHomeAddModalTranslate,
    jaHomeAddModalTranslate,
} from "./components/home-add-modal/home-add-modal.translate";
import {
    HomeEditModalTranslate,
    enHomeEditModalTranslate,
    jaHomeEditModalTranslate,
} from "./components/home-edit-modal/home-edit-modal.translate";
import {
    HomeDeleteModalTranslate,
    enHomeDeleteModalTranslate,
    jaHomeDeleteModalTranslate,
} from "./components/home-delete-modal/home-delete-modal.translate";
import { StatusTranslate, enStatusTranslate, jaStatusTranslate } from "./components/status/status.translate";
import { LanguageTranslate, enLanguageTranslate, jaLanguageTranslate } from "./components/language/language.translate";
import { HeaderTranslate, enHeaderTranslate, jaHeaderTranslate } from "./components/header/header.translate";
import { EmojiTranslate, enEmojiTranslate, jaEmojiTranslate } from "./components/emoji/emoji.translate";
import { LogTranslate, enLogTranslate, jaLogTranslate } from "./components/log/log.translate";
import { AboutTranslate, enAboutTranslate, jaAboutTanslate } from "./components/about/about.translate";
import { AccountTranslate, enAccountTranslate, jaAccountTranslate } from "./components/account/account.translate";

export interface AppTranslate {
    homeTranslate: HomeTranslate;
    homeAddModalTranslate: HomeAddModalTranslate;
    homeEditModalTranslate: HomeEditModalTranslate;
    homeDeleteModalTranslate: HomeDeleteModalTranslate;
    statusTranslate: StatusTranslate;
    languageTranslate: LanguageTranslate;
    headerTranslate: HeaderTranslate;
    emojiTranslate: EmojiTranslate;
    logTranslate: LogTranslate;
    aboutTranslate: AboutTranslate;
    accountTranslate: AccountTranslate;
}

export const enAppTranslate: AppTranslate = {
    homeTranslate: enHomeTranslate,
    homeAddModalTranslate: enHomeAddModalTranslate,
    homeEditModalTranslate: enHomeEditModalTranslate,
    homeDeleteModalTranslate: enHomeDeleteModalTranslate,
    statusTranslate: enStatusTranslate,
    languageTranslate: enLanguageTranslate,
    headerTranslate: enHeaderTranslate,
    emojiTranslate: enEmojiTranslate,
    logTranslate: enLogTranslate,
    aboutTranslate: enAboutTranslate,
    accountTranslate: enAccountTranslate,
};
export const jaAppTranslate: AppTranslate = {
    homeTranslate: jaHomeTranslate,
    homeAddModalTranslate: jaHomeAddModalTranslate,
    homeEditModalTranslate: jaHomeEditModalTranslate,
    homeDeleteModalTranslate: jaHomeDeleteModalTranslate,
    statusTranslate: jaStatusTranslate,
    languageTranslate: jaLanguageTranslate,
    headerTranslate: jaHeaderTranslate,
    emojiTranslate: jaEmojiTranslate,
    logTranslate: jaLogTranslate,
    aboutTranslate: jaAboutTanslate,
    accountTranslate: jaAccountTranslate,
};
