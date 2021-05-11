/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingPageComponent} from './landing-page.component';
import {LandingPageRoutingModule} from './landing-page-routing.module';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        LandingPageComponent
    ],
    imports: [
        CommonModule,
        LandingPageRoutingModule,
        FormsModule
    ]
})
export class LandingPageModule {
}
