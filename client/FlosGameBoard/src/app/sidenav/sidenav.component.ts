/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {LobbyInfo} from '../shared/utils';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {CreateLobbyDialogComponent} from '../lobby/create-lobby-dialog/create-lobby-dialog.component';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {

    lobbies: LobbyInfo[] = [];
    private unsubscribe = new Subject<void>();
    private messages: string[] = [];
    message = '';

    constructor(private readonly connection: ConnectionService, private readonly dialog: MatDialog) {
        this.connection.getLobbies().pipe(takeUntil(this.unsubscribe)).subscribe(info => this.lobbies = info);
        this.connection.landingChat.pipe(takeUntil(this.unsubscribe)).subscribe(m => this.messages.push(m))
    }

    ngOnInit(): void {
    }

    createLobby(): void {
        this.dialog.open(CreateLobbyDialogComponent, {data: {connection: this.connection}});
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    joinLobby(id: number) {
        this.connection.joinLobby(id);
    }

    inGame() {
        return this.connection.game !== null;
    }

    getGameDescription() {
        return this.connection.game?.howToPlay() || 'No description found';
    }

    postMessage() {
        this.connection.postMessage(this.message);
    }

}
