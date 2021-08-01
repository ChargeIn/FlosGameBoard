/*
 * Copyright (c) Florian Plesker
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { SidenavService } from './sidenav/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    @ViewChild('sidenav', { static: false }) sideNav: MatSidenav | undefined;

    title = 'GameBoard';
    showSideNav = window.innerWidth > 1200;

    constructor(private readonly sidenavService: SidenavService) {
        sidenavService.onShowLobbies.subscribe(() =>
            this.sideNav?.toggle(true),
        );
        sidenavService.closeSideNav.subscribe(() => {
            if (!this.showSideNav) {
                this.sideNav?.toggle(false);
            }
        });
    }
}
