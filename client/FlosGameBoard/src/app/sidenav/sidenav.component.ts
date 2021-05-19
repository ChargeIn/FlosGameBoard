/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {LobbyInfo} from '../shared/utils';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

    lobbies: LobbyInfo[] = [];
    private unsubscribe = new Subject<void>();

    constructor(private readonly connection: ConnectionService) {
        this.connection.getLobbies().pipe(takeUntil(this.unsubscribe)).subscribe(info => this.lobbies = info);
    }

    ngOnInit(): void {
    }

    createLobby(): void {
        this.connection.createLobby('test', 'test');
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    joinLobby(id: number) {
        this.connection.joinLobby('test2', id);
    }

    inGame() {
        return this.connection.game !== null;
    }

    getGameDescription() {
        return this.connection.game?.howToPlay() || 'No description found';
    }
}
