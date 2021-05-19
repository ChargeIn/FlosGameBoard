/*
 * Copyright (c) Florian Plesker
 */

import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidenavService implements OnDestroy {

    showSideNav = new Subject<void>();

    constructor() {
    }

    toggleSideNav() {
        this.showSideNav.next();
    }

    ngOnDestroy(): void {
        this.showSideNav.complete();
    }
}
