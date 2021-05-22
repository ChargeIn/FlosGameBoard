/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from './sidenav.component';
import {SidenavService} from './sidenav.service';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {ChatComponent} from './chat/chat.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { LobbyInfoComponent } from './lobby-info/lobby-info.component';


@NgModule({
    declarations: [
        SidenavComponent,
        ChatComponent,
        LobbyInfoComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        FormsModule,
        MatToolbarModule,
        MatButtonToggleModule
    ],
    exports: [
        SidenavComponent
    ],
    providers: [
        SidenavService
    ]
})
export class SidenavModule {
}
