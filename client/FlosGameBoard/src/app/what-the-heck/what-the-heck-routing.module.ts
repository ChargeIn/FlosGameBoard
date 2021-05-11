/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WhatTheHeckComponent} from './what-the-heck.component';

const routes: Routes = [
    {path: '', component: WhatTheHeckComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WhatTheHeckRoutingModule {
}
