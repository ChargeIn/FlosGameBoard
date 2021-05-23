/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LobbyComponent} from './lobby.component';
import {LobbyModule} from './lobby.module';

const routes: Routes = [
    {path: '', component: LobbyComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes), LobbyModule],
    exports: [RouterModule]
})
export class LobbyRoutingModule {
}
