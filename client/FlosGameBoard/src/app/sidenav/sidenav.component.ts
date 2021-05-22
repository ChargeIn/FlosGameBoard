/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {LobbyInfo} from '../shared/utils';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

type Tab = 'Chat' | 'HowToPlay' | 'Lobby';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

    lobbies: LobbyInfo[] = [];
    private unsubscribe = new Subject<void>();
    currentTab: Tab = 'Lobby';

    constructor(private readonly connection: ConnectionService) {
        this.connection.getLobbies().pipe(takeUntil(this.unsubscribe)).subscribe(info => this.lobbies = info);
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
