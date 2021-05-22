/*
 * Copyright (c) Florian Plesker
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from './sidenav.component';
import {SidenavService} from './sidenav.service';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {ChatComponent} from './chat/chat.component';


@NgModule({
    declarations: [
        SidenavComponent,
        ChatComponent,
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        FormsModule
    ],
    exports: [
        SidenavComponent
    ],
    providers: [
        SidenavService
    ]
})
export class SidenavModule {
}
