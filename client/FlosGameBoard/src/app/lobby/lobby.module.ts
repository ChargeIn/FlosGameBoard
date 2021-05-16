/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LobbyComponent} from './lobby.component';
import {LobbyRoutingModule} from './lobby-routing.module';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
    declarations: [
        LobbyComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule
    ],
    providers: [],
    exports: [
        LobbyComponent,
        LobbyRoutingModule
    ]
})
export class LobbyModule {
}
