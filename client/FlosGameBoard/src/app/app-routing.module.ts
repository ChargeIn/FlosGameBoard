/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: 'what-the-heck',
        loadChildren: () => import('./what-the-heck/what-the-heck-routing.module').then(m => m.WhatTheHeckRoutingModule)
    },
    {
        path: '**',
        loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
