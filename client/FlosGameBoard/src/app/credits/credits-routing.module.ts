/*
 * Copyright (c) Florian Plesker
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreditsComponent } from './credits.component';
import { CreditsModule } from './credits.module';

const routes: Routes = [{ path: '', component: CreditsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), CreditsModule],
  exports: [RouterModule],
})
export class CreditsRoutingModule {}
