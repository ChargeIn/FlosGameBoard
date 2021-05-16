/*
 * Copyright (c) Florian Plesker
 */

import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {LobbyInfo, UserInfo} from '../shared/utils';
import {Game, GameTypes} from '../shared/game-utils'
import {Router} from '@angular/router';
import {WhatTheHeck} from '../what-the-heck/WhatTheHeck';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {

    landingChat: Observable<string>;
    lobby: LobbyInfo | null = null;
    game: Game | null = null;

    constructor(private socket: Socket, private readonly router: Router) {
        socket.connect();

        this.landingChat = this.socket.fromEvent('landingChat');

        this.socket.on('joinLobby', (lobbyAck: LobbyInfo) => {
            this.socket.removeAllListeners('landingPage');
            this.lobby = lobbyAck;
            this.router.navigate(['lobby']);

            this.socket.on('playerJoined', (userInfo: UserInfo) => {
                this.lobby!.userCount!++;
                this.lobby!.users.push(userInfo);
            });

            this.socket.on('playerLeft', (id: string) => {
                this.lobby!.userCount--;
                this.lobby!.users = this.lobby!.users.filter(user => user.id !== id);
            });

            this.socket.on('changeHost', (host: boolean) => this.lobby!.host = host);

            this.socket.on('gameStarted', (type: number) => this.loadGame(type))
        });
    }

    postMessage(message: string) {
        this.socket.emit('landingChat', message);
    }

    getLobbies(): Observable<LobbyInfo[]> {
        this.socket.emit('getLobbies');
        return this.socket.fromEvent<LobbyInfo[]>('lobbies');
    }

    createLobby(user: string, name: string) {
        this.socket.emit('createLobby', ({user, name}));
    }

    leaveLobby() {
        this.socket.removeAllListeners('playerJoined');
        this.socket.removeAllListeners('playerLeft')
        this.socket.removeAllListeners('changeHost');
        this.socket.removeAllListeners('gameStarted');

        this.socket.emit('leaveLobby', this.lobby!.id);
        this.lobby = null;
    }

    joinLobby(user: string, lobbyId: number) {
        this.socket.emit('joinLobby', ({user, lobbyId}));
    }

    startGame(type: number) {
        this.socket.emit('startGame', type);
    }

    loadGame(type: number) {
        switch (type) {
            case GameTypes.WHAT_THE_HECK:
                this.game = new WhatTheHeck(this.socket);
                break;
            default:
                this.game = new WhatTheHeck(this.socket);
        }

        this.router.navigate([GameTypes.getGamePath(type)])
    }
}
