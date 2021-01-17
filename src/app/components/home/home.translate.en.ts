import { HomeTranslate } from "./home.translate";

export const enHomeTranslate: HomeTranslate = {
    title: "Home",
    automationState: (enabled: boolean) => (enabled ? "Automation: On" : "Automation: Off"),
    on: "On",
    off: "Off",
    intervalSeconds: "Interval Seconds",
    automationTitle: "Automations",
    automationHelp:
        "If matching automation condition, change slack status. If multiple automation matched, The one at the top has priority.",
    defaultStatusTitle: "Default",
};
