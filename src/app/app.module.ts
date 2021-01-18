import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { EmojiModule } from "@ctrl/ngx-emoji-mart/ngx-emoji";

import { AppRoutingModule } from "./modules/app-routing.module";
import { AppComponent } from "./app.component";
import { OauthComponent } from "./components/oauth/oauth.component";
import { HomeComponent } from "./components/home/home.component";
import { IndexComponent } from "./components/index/index.component";
import { HeaderComponent } from "./components/header/header.component";
import { EmojiComponent } from "./components/emoji/emoji.component";
import { EmojiPipe } from "./pipes/emoji.pipe";
import { HomeAddModalComponent } from "./components/home-add-modal/home-add-modal.component";
import { HomeEditModalComponent } from "./components/home-edit-modal/home-edit-modal.component";
import { AccountComponent } from "./components/account/account.component";
import { LogComponent } from "./components/log/log.component";
import { AboutComponent } from "./components/about/about.component";
import { StatusComponent } from "./components/status/status.component";
import { LanguageComponent } from "./components/language/language.component";
import { HomeDeleteModalComponent } from "./components/home-delete-modal/home-delete-modal.component";

@NgModule({
    declarations: [
        AppComponent,
        OauthComponent,
        HomeComponent,
        IndexComponent,
        HeaderComponent,
        EmojiComponent,
        EmojiPipe,
        HomeAddModalComponent,
        HomeEditModalComponent,
        AccountComponent,
        LogComponent,
        AboutComponent,
        StatusComponent,
        LanguageComponent,
        HomeDeleteModalComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRoutingModule,
        NgbModule,
        MatButtonModule,
        MatIconModule,
        PickerModule,
        EmojiModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
