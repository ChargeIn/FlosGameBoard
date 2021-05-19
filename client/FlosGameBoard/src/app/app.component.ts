/*
 * Copyright (c) Florian Plesker
 */

import {Component, ViewChild} from '@angular/core';
import {SidenavService} from './sidenav/sidenav.service';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    @ViewChild('sidenav', {static: false}) sideNav: MatSidenav | undefined;

    title = 'FlosGameBoard';
    showSideNav = window.innerWidth > 1200;

    constructor(private readonly sidenavService: SidenavService) {
        sidenavService.showSideNav.subscribe(() => this.sideNav?.toggle());
    }
}
