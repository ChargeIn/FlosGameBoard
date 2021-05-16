/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnInit} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {LobbyInfo} from '../shared/utils';
import {Router} from '@angular/router';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

    lobbyInfo: LobbyInfo;

    constructor(private readonly connection: ConnectionService, private readonly router: Router) {
        this.lobbyInfo = connection.lobby!;
    }

    ngOnInit(): void {
    }

    start() {
        this.connection.startGame(this.lobbyInfo.type);
    }

    leaveLobby() {
        this.connection.leaveLobby();
        this.router.navigate(['/']);
    }
}
