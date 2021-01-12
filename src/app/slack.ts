import * as slack from "@slack/web-api";

export interface OauthV2AccessResult extends slack.WebAPICallResult {
    team: {
        id: string;
    };
    authed_user: {
        id: string;
        access_token: string;
    };
}

export interface AuthTestResult extends slack.WebAPICallResult {
    team: string;
    user: string;
    team_id: string;
    user_id: string;
}

export interface EmojiListResult extends slack.WebAPICallResult {
    emoji: {
        [key: string]: string;
    };
}

export function createSlackClient(token: string | undefined): slack.WebClient {
    const client = new slack.WebClient(token);
    // if has user-agent, reject setRequestHeader by browser
    delete client["axios"].defaults.headers["User-Agent"];
    return client;
}
