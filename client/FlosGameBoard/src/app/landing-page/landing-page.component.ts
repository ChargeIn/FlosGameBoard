/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnDestroy} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnDestroy {

    message = '';
    messages: string[] = [];
    private unsubscribe = new Subject<void>();

    constructor(private readonly connection: ConnectionService) {
        this.connection.landingChat.pipe(takeUntil(this.unsubscribe)).subscribe(m => this.messages.push(m))
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    postMessage() {
        this.connection.postMessage(this.message);
    }

    toWhatTheHeck() {
        this.connection.stop('landingPage');
    }
}
