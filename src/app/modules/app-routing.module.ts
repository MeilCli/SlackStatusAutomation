import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "../components/index/index.component";
import { HomeComponent } from "../components/home/home.component";
import { OauthComponent } from "../components/oauth/oauth.component";
import { EmojiComponent } from "../components/emoji/emoji.component";
import { AccountComponent } from "../components/account/account.component";
import { LogComponent } from "../components/log/log.component";
import { LicenseComponent } from "../components/license/license.component";

const routes: Routes = [
    { path: "", component: IndexComponent },
    { path: "home", component: HomeComponent },
    { path: "oauth", component: OauthComponent },
    { path: "emoji", component: EmojiComponent },
    { path: "account", component: AccountComponent },
    { path: "log", component: LogComponent },
    { path: "license", component: LicenseComponent },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled", anchorScrolling: "enabled" })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
