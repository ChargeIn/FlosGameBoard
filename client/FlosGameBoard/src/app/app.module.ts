/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
    declarations: [
        AppComponent,
        SidenavComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatTooltipModule,
        SocketIoModule.forRoot(environment.config),
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
