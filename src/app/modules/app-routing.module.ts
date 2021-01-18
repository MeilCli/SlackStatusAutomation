import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { IndexComponent } from "../components/index/index.component";
import { HomeComponent } from "../components/home/home.component";
import { OauthComponent } from "../components/oauth/oauth.component";
import { EmojiComponent } from "../components/emoji/emoji.component";
import { AccountComponent } from "../components/account/account.component";
import { LanguageComponent } from "../components/language/language.component";
import { LogComponent } from "../components/log/log.component";
import { AboutComponent } from "../components/about/about.component";

const routes: Routes = [
    { path: "", component: IndexComponent },
    { path: "home", component: HomeComponent },
    { path: "oauth", component: OauthComponent },
    { path: "emoji", component: EmojiComponent },
    { path: "account", component: AccountComponent },
    { path: "language", component: LanguageComponent },
    { path: "log", component: LogComponent },
    { path: "about", component: AboutComponent },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "enabled", anchorScrolling: "enabled" })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
