import { Component, OnInit, OnDestroy } from "@angular/core";
import { createSlackClient, OauthV2AccessResult, AuthTestResult } from "../../slack";
import { environment } from "../../../environments/environment";
import { StoreService } from "src/app/services/store.service";
import { Router } from "@angular/router";
import { Status, StatusAutomation } from "src/app/entities";
import { ShellService } from "src/app/services/shell.service";
import { OauthService } from "src/app/services/oauth.service";

interface Application {
    clientId: string;
    clientSecret: string;
    name: string;
    statusAutomations: StatusAutomation[] | undefined | null;
    defaultStatus: Status | undefined | null;
}

interface Environment {
    applications: Application[] | undefined | null;
}

@Component({
    selector: "app-oauth",
    templateUrl: "./oauth.component.html",
    styleUrls: ["./oauth.component.scss"],
})
export class OauthComponent implements OnInit, OnDestroy {
    private currentRequest: "custom" | number | null = null;

    public customClientId = "";
    public customClientSecret = "";
    public environment: Environment = environment;

    constructor(
        private router: Router,
        private readonly storeService: StoreService,
        private readonly shellService: ShellService,
        private readonly oauthService: OauthService
    ) {}

    authorizeUrl(clientId: string): string {
        const clientIdParameter = `client_id=${clientId}`;
        const scopeParameter = "user_scope=emoji:read,users.profile:write";
        const redirectUriParameter = "redirect_uri=http://localhost:3333/";
        return `https://slack.com/oauth/v2/authorize?${clientIdParameter}&${scopeParameter}&${redirectUriParameter}`;
    }

    ngOnInit(): void {
        this.oauthService.start((code) => {
            this.requestAccessToken(code);
        });
    }

    ngOnDestroy(): void {
        this.oauthService.end();
    }

    onClickCustomAuthenticate() {
        if (this.customClientId.length == 0 || this.customClientSecret.length == 0) {
            return;
        }
        this.currentRequest = "custom";
        this.shellService.openExternalBrowser(this.authorizeUrl(this.customClientId));
    }

    onClickAuthenticate(index: number) {
        if (this.environment.applications == undefined || this.environment.applications == null) {
            return;
        }
        this.currentRequest = index;
        this.shellService.openExternalBrowser(this.authorizeUrl(this.environment.applications[index].clientId));
    }

    findCurrentRequestClient(): [string, string] | null {
        if (this.environment.applications == undefined || this.environment.applications == null) {
            return null;
        }
        if (this.currentRequest == null) {
            return null;
        }
        if (this.currentRequest == "custom") {
            return [this.customClientId, this.customClientSecret];
        }
        return [
            this.environment.applications[this.currentRequest].clientId,
            this.environment.applications[this.currentRequest].clientSecret,
        ];
    }

    async requestAccessToken(code: string): Promise<void> {
        if (this.environment.applications == undefined || this.environment.applications == null) {
            return;
        }
        const currentRequestClient = this.findCurrentRequestClient();
        if (currentRequestClient == null) {
            return;
        }
        const noAuthorizedClient = createSlackClient(undefined);
        const oauthAccessResponse = (await noAuthorizedClient.oauth.v2.access({
            code,
            client_id: currentRequestClient[0],
            client_secret: currentRequestClient[1],
            redirect_uri: "http://localhost:3333/",
        })) as OauthV2AccessResult;
        const autorizedClient = createSlackClient(oauthAccessResponse.authed_user.access_token);
        const authTestResponse = (await autorizedClient.auth.test()) as AuthTestResult;
        this.storeService.addAccount(
            oauthAccessResponse.authed_user.access_token,
            authTestResponse.user_id,
            authTestResponse.user,
            authTestResponse.team_id,
            authTestResponse.team
        );
        if (typeof this.currentRequest == "number") {
            const application = this.environment.applications[this.currentRequest];
            const statusAutomations: StatusAutomation[] | undefined | null = application.statusAutomations;
            const defaultStatus: Status | undefined | null = application.defaultStatus;
            if (statusAutomations != undefined && statusAutomations != null) {
                this.storeService.updateStatusAutomations(
                    authTestResponse.user_id,
                    authTestResponse.team_id,
                    statusAutomations
                );
            }
            if (defaultStatus !== undefined && defaultStatus != null) {
                this.storeService.updateDefaultStatus(
                    authTestResponse.user_id,
                    authTestResponse.team_id,
                    defaultStatus
                );
            }
        }
        this.router.navigateByUrl("/home");
    }
}
