/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {ChatMessage, LobbyInfoSmall} from '../shared/utils';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {SidenavService} from './sidenav.service';

type Tab = 'Chat' | 'HowToPlay' | 'Lobby';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

    lobbies: LobbyInfoSmall[] = [];
    messages: ChatMessage[] = [];
    private unsubscribe = new Subject<void>();
    currentTab: Tab = 'Lobby';

    constructor(private readonly connection: ConnectionService, private readonly navService: SidenavService) {
        this.connection.getLobbies().pipe(takeUntil(this.unsubscribe)).subscribe(info => this.lobbies = info);

        this.connection.chat.pipe(takeUntil(this.unsubscribe)).subscribe(msg => {
            this.messages.push(msg);
            const length = this.messages.length;
            this.messages = this.messages.filter((_m, i) => length - i < 30);
        });

        this.navService.onShowLobbies.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.currentTab = 'Lobby');
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    inGame() {
        return this.connection.game !== null;
    }

    getGameDescription() {
        return this.connection.game?.howToPlay() || 'No description found';
    }

    changeTabs(tab: Tab) {
        this.currentTab = tab;
    }
}
