/*
 * Copyright (c) Florian Plesker
 */

import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {LobbyInfo, UserInfo} from '../shared/utils';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {

    landingChat: Observable<string>;
    lobby: LobbyInfo | null = null;

    constructor(private readonly socket: Socket, private readonly router: Router) {
        socket.connect();

        this.landingChat = this.socket.fromEvent('landingChat');

        this.socket.on('joinLobby', (lobbyAck: LobbyInfo) => {
            this.lobby = lobbyAck;
            this.router.navigate(['lobby']);
        });

        this.socket.on('playerJoined', (userInfo: UserInfo) => {
            this.lobby!.userCount!++;
            this.lobby!.users.push(userInfo);
        });
    }

    stop(namespace: string) {
        this.socket.removeListener(namespace);
    }

    postMessage(message: string) {
        this.socket.emit('landingChat', message);
    }

    getLobbies(): Observable<LobbyInfo[]> {
        this.socket.emit('getLobbies');
        return this.socket.fromEvent<{ lobbies: LobbyInfo[] }>('lobbies').pipe(map(obj => obj.lobbies));
    }

    createLobby(user: string, name: string) {
        this.socket.emit('createLobby', ({user, name}));
    }

    leaveLobby() {
        this.socket.emit('leaveLobby', this.lobby!.id);
        this.lobby = null;
    }

    joinLobby(user: string, lobbyId: number) {
        this.socket.emit('joinLobby', ({user, lobbyId}));
    }
}
