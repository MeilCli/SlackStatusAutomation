// execute on main process
import { ipcMain, ipcRenderer } from "electron";
import * as slack from "@slack/web-api";

interface OauthV2AccessResult extends slack.WebAPICallResult {
    team: {
        id: string;
    };
    authed_user: {
        id: string;
        access_token: string;
    };
}

export interface OauthV2Access {
    team: {
        id: string;
    };
    authed_user: {
        id: string;
        access_token: string;
    };
}

interface AuthTestResult extends slack.WebAPICallResult {
    team: string;
    user: string;
    team_id: string;
    user_id: string;
}

export interface AuthTest {
    team: string;
    user: string;
    team_id: string;
    user_id: string;
}

interface EmojiListResult extends slack.WebAPICallResult {
    emoji: {
        [key: string]: string;
    };
}

export interface EmojiList {
    emoji: {
        [key: string]: string;
    };
}

export interface SlackApi {
    oauthV2Access: (
        code: string,
        clientId: string,
        clientSecret: string,
        redirectUri: string
    ) => Promise<OauthV2Access>;
    authTest: (token: string) => Promise<AuthTest>;
    emojiList: (token: string) => Promise<EmojiList>;
}

export const slackApi: SlackApi = {
    oauthV2Access: async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
        return (await ipcRenderer.invoke(
            "slack-oauthv2-access",
            code,
            clientId,
            clientSecret,
            redirectUri
        )) as OauthV2Access;
    },
    authTest: async (token: string) => {
        return (await ipcRenderer.invoke("slack-auth-test", token)) as AuthTest;
    },
    emojiList: async (token: string) => {
        return (await ipcRenderer.invoke("slack-emoji-list", token)) as EmojiList;
    },
};

export class Slack {
    start() {
        ipcMain.handle("slack-oauthv2-access", async (_, code, clientId, clientSecret, redirectUri) => {
            if (
                typeof code != "string" ||
                typeof clientId != "string" ||
                typeof clientSecret != "string" ||
                typeof redirectUri != "string"
            ) {
                throw Error();
            }
            return await this.oauthV2Access(code, clientId, clientSecret, redirectUri);
        });
        ipcMain.handle("slack-auth-test", async (_, token) => {
            if (typeof token != "string") {
                throw Error();
            }
            return await this.authTest(token);
        });
        ipcMain.handle("slack-emoji-list", async (_, token) => {
            if (typeof token != "string") {
                throw Error();
            }
            return await this.emojiList(token);
        });
    }

    createSlackClient(token: string | undefined): slack.WebClient {
        const client = new slack.WebClient(token);
        // if has user-agent, reject setRequestHeader by browser
        delete client["axios"].defaults.headers["User-Agent"];
        return client;
    }

    async oauthV2Access(
        code: string,
        clientId: string,
        clientSecret: string,
        redirectUri: string
    ): Promise<OauthV2Access> {
        const noAuthorizedClient = this.createSlackClient(undefined);
        const oauthAccessResponse = (await noAuthorizedClient.oauth.v2.access({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
        })) as OauthV2AccessResult;
        return oauthAccessResponse;
    }

    async authTest(token: string): Promise<AuthTest> {
        const client = this.createSlackClient(token);
        const authTestResponse = (await client.auth.test()) as AuthTestResult;
        return authTestResponse;
    }

    async emojiList(token: string): Promise<EmojiList> {
        const client = this.createSlackClient(token);
        const emojiListResponse = (await client.emoji.list()) as EmojiListResult;
        return emojiListResponse;
    }
}
