/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LobbyComponent} from './lobby.component';
import {LobbyRoutingModule} from './lobby-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {CreateLobbyDialogComponent} from './create-lobby-dialog/create-lobby-dialog.component';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        LobbyComponent,
        CreateLobbyDialogComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        FormsModule
    ],
    providers: [],
    exports: [
        LobbyComponent,
        LobbyRoutingModule
    ]
})
export class LobbyModule {
}
