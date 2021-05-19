/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnDestroy} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SidenavService} from '../sidenav/sidenav.service';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnDestroy {

    message = '';
    messages: string[] = [];
    private unsubscribe = new Subject<void>();

    constructor(private readonly connection: ConnectionService, private readonly sideNav: SidenavService) {
        this.connection.landingChat.pipe(takeUntil(this.unsubscribe)).subscribe(m => this.messages.push(m))
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    postMessage() {
        this.connection.postMessage(this.message);
    }

    setName(name: string) {
        // need to be checked, because of clear events
        if (typeof name === 'string') {
            this.connection.setName(name);
        }
    }

    getAvatar() {
        return `assets/avatars/${this.connection.avatar}.png`;
    }

    changeAvatar() {
        this.connection.avatar = Math.round(Math.random() * 18) + 1;
    }

    isSmallScreen() {
        return window.innerWidth < 1200;
    }

    openLobbies() {
        this.sideNav.toggleSideNav();
    }
}
