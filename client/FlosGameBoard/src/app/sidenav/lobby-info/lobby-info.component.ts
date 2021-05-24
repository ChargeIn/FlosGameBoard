/*
 * Copyright (c) Florian Plesker
 */

import {Component, Input, OnInit} from '@angular/core';
import {LobbyInfoSmall} from '../../shared/utils';
import {ConnectionService} from '../../connection/connection.service';
import {CreateLobbyDialogComponent} from '../../lobby/create-lobby-dialog/create-lobby-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-lobby-info',
    templateUrl: './lobby-info.component.html',
    styleUrls: ['./lobby-info.component.scss']
})
export class LobbyInfoComponent implements OnInit {

    @Input() lobbies: LobbyInfoSmall[] = [];

    constructor(private readonly connection: ConnectionService, private readonly dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

    joinLobby(id: number) {
        if (this.lobbies[id].userCount > 4) {
            return
        }

        this.connection.joinLobby(id);
    }

    createLobby(): void {
        this.dialog.open(CreateLobbyDialogComponent, {data: {connection: this.connection}});
    }
}
