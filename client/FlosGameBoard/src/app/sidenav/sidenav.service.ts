/*
 * Copyright (c) Florian Plesker
 */

import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidenavService implements OnDestroy {

    onShowLobbies = new Subject<void>();

    constructor() {
    }

    showLobbies() {
        this.onShowLobbies.next();
    }

    ngOnDestroy(): void {
        this.onShowLobbies.complete();
    }
}
