import { HomeTranslate } from "./home.translate";

export const jaHomeTranslate: HomeTranslate = {
    title: "ホーム",
    automationState: (enabled: boolean) => (enabled ? "オートメーション: オン" : "オートメーション: オフ"),
    on: "オン",
    off: "オフ",
    intervalSeconds: "インターバル(秒)",
    automationTitle: "オートメーション",
    automationHelp:
        "オートメーションの条件に一致したらSlackのStatusを変更します。複数のオートメーションに一致したら上部にあるものが優先されます",
    defaultStatusTitle: "デフォルト",
    defaultStatusHelp: "オートメーションの条件に一致しなかった場合にSlackのStatusに設定されます",
};
