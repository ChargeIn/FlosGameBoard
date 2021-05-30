/*
 * Copyright (c) Florian Plesker
 */

import { Component } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { LobbyInfo } from '../shared/utils';
import { Router } from '@angular/router';
import { GameTypes } from '../shared/game-utils';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
    lobbyInfo: LobbyInfo;
    isReady = false;

    constructor(
        private readonly connection: ConnectionService,
        private readonly router: Router,
    ) {
        this.lobbyInfo = connection.lobby!;
    }

    start() {
        this.connection.startGame(this.lobbyInfo.type);
    }

    leaveLobby() {
        this.connection.leaveLobby();
        this.router.navigate(['/']);
    }

    onGameChange(type: number) {
        this.connection.changeGame(type);
    }

    getGame() {
        return GameTypes.getName(this.lobbyInfo.type);
    }

    ready() {
        this.isReady = !this.isReady;
        this.connection.ready(this.isReady);
    }
}
