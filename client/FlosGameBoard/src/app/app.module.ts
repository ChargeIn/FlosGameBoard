/*
 * Copyright (c) Florian Plesker
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import {ConnectionService} from './connection/connection.service';
import {SocketIoModule} from 'ngx-socket-io';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(environment.config),
  ],
  providers: [
      ConnectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
