/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnDestroy} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {Subject} from 'rxjs';
import {SidenavService} from '../sidenav/sidenav.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnDestroy {

    playerName = '';
    private unsubscribe = new Subject<void>();

    constructor(private readonly connection: ConnectionService, private readonly sideNav: SidenavService) {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    setName(name: string) {
        // need to be checked, because of clear events
        if (typeof name === 'string') {
            this.playerName = name.substr(0, 25);
            this.connection.setName(this.playerName);
        }
    }

    getAvatar() {
        return `assets/avatars/${this.connection.avatar}.png`;
    }

    changeAvatar() {
        let next = Math.round(Math.random() * 19);

        while (next === this.connection.avatar) {
            next = Math.round(Math.random() * 19);
        }

        this.connection.avatar = next;
    }

    isSmallScreen() {
        return window.innerWidth < 1200;
    }

    openLobbies() {
        this.sideNav.showLobbies();
    }
}
