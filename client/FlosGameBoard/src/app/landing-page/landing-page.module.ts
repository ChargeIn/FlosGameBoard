/*
 * Copyright (c) Florian Plesker
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [LandingPageComponent, LandingPageRoutingModule],
})
export class LandingPageModule {}
