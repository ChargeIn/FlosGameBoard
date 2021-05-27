/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CommonModule} from '@angular/common';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SidenavService} from './sidenav/sidenav.service';
import {MatDialogModule} from '@angular/material/dialog';
import {SidenavModule} from './sidenav/sidenav.module';
import {SocketIoModule} from './connection/socket/socket-io.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        SocketIoModule.forRoot(environment.config),
        BrowserAnimationsModule,
        MatDialogModule,
        SidenavModule,
    ],
    providers: [
        SidenavService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
