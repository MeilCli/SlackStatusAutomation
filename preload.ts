import { contextBridge } from "electron";
import { automationApi } from "./src/automation";
import { loggerApi } from "./src/logger";
import { oauthApi } from "./src/oauth";
import { shellApi } from "./src/shell";
import { storeApi } from "./src/store";
import { slackApi } from "./src/slack";

contextBridge.exposeInMainWorld("automation", automationApi);
contextBridge.exposeInMainWorld("logger", loggerApi);
contextBridge.exposeInMainWorld("oauth", oauthApi);
contextBridge.exposeInMainWorld("shell", shellApi);
contextBridge.exposeInMainWorld("store", storeApi);
contextBridge.exposeInMainWorld("slack", slackApi);
