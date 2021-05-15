/*
 * Copyright (c) Florian Plesker
 */

import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {LobbyInfo} from '../shared/utils';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {

    landingChat: Observable<string>;

    constructor(private socket: Socket) {
        socket.connect();

        this.landingChat = this.socket.fromEvent('landingChat');
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
        this.socket.emit('createLobby', {user, name});
    }
}
