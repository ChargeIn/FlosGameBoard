/*
 * Copyright (c) Florian Plesker
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WhatTheHeckComponent } from './what-the-heck.component';
import { WhatTheHeckModule } from './what-the-heck.module';

const routes: Routes = [{ path: '', component: WhatTheHeckComponent }];

@NgModule({
    imports: [WhatTheHeckModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WhatTheHeckRoutingModule {}
