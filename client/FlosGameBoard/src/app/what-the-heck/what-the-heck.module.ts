/*
 * Copyright (c) Florian Plesker
 */

import { NgModule } from '@angular/core';
import { WhatTheHeckComponent } from './what-the-heck.component';
import { SharedModule } from '../shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [SharedModule, MatIconModule],
    declarations: [WhatTheHeckComponent],
    exports: [WhatTheHeckComponent],
})
export class WhatTheHeckModule {}
