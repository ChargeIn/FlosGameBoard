/*
 * Copyright (c) Florian Plesker
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyGuard } from './lobby/lobby.guard';
import { WhatTheHeckGuard } from './what-the-heck/what-the-heck.guard';

const routes: Routes = [
  {
    path: 'lobby',
    loadChildren: () =>
      import('./lobby/lobby-routing.module').then((m) => m.LobbyRoutingModule),
    canActivate: [LobbyGuard],
  },
  {
    path: 'what-the-heck',
    loadChildren: () =>
      import('./what-the-heck/what-the-heck-routing.module').then(
        (m) => m.WhatTheHeckRoutingModule,
      ),
    canActivate: [WhatTheHeckGuard],
  },
  {
    path: 'credits',
    loadChildren: () =>
      import('./credits/credits-routing.module').then(
        (m) => m.CreditsRoutingModule,
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./landing-page/landing-page.module').then(
        (m) => m.LandingPageModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LobbyGuard, WhatTheHeckGuard],
})
export class AppRoutingModule {}
