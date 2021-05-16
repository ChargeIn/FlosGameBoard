/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {WhatTheHeckComponent} from './what-the-heck.component';
import {SharedModule} from '../shared/shared.module';


@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        WhatTheHeckComponent
    ],
    exports: [
        WhatTheHeckComponent
    ]
})
export class WhatTheHeckModule {
}
