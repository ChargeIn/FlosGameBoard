/*
 * Copyright (c) Florian Plesker
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ViewChild,
} from '@angular/core';
import { SidenavService } from './sidenav/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AppService } from './app.service';

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
    transition = false;

    constructor(
        private readonly sidenavService: SidenavService,
        private readonly appService: AppService,
        private readonly cd: ChangeDetectorRef,
    ) {
        sidenavService.onShowLobbies.subscribe(() =>
            this.sideNav?.toggle(true),
        );
        sidenavService.closeSideNav.subscribe(() => {
            if (!this.showSideNav) {
                this.sideNav?.toggle(false);
            }
        });

        appService.transition.subscribe(() => {
            this.transition = true;
            this.cd.markForCheck();
            setTimeout(() => {
                this.transition = false;
                this.cd.markForCheck();
            }, 1000);
        });
    }
}
