/*
 * Copyright (c) Florian Plesker
 */

import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    ChatMessage,
    LobbyInfo,
    LobbyInfoSmall,
    UserInfo,
} from '../shared/utils';
import { Game, GameTypes } from '../shared/game-utils';
import { Router } from '@angular/router';
import { WhatTheHeck } from '../what-the-heck/WhatTheHeck';
import { Title } from '@angular/platform-browser';
import { CreateLobbyRequest, JoinLobbyRequest } from '../shared/request';
import { SidenavService } from '../sidenav/sidenav.service';
import { WrappedSocket } from './socket/socket-io.service';
import { AppService } from '../app.service';

@Injectable({
    providedIn: 'root',
})
export class ConnectionService {
    chat: Observable<ChatMessage>;
    lobby: LobbyInfo | null = null;
    game: Game | null = null;
    name: string = 'Unknown';
    avatar: number = 0;
    id: string = '';

    lobbyChanged = new EventEmitter();

    constructor(
        private socket: WrappedSocket,
        private readonly router: Router,
        private titleService: Title,
        private readonly sideNav: SidenavService,
        private readonly appService: AppService,
    ) {
        socket.connect();
        this.chat = this.socket.fromEvent('chat');

        this.socket.on('joinLobby', (lobbyAck: LobbyInfo) => {
            this.sideNav.close();
            this.appService.startTransition(() => {
                this.router.navigate(['lobby']);
                this.titleService.setTitle('Lobby: ' + lobbyAck.name);
            });

            this.socket.removeAllListeners('landingPage');
            this.lobby = lobbyAck;

            this.socket.on('playerJoined', (userInfo: UserInfo) => {
                this.lobby!.userCount!++;
                this.lobby!.users.push(userInfo);
                this.lobbyChanged.emit();
            });

            this.socket.on('playerLeft', (id: string) => {
                this.lobby!.userCount--;
                this.lobby!.users = this.lobby!.users.filter(
                    (user) => user.id !== id,
                );
                this.lobbyChanged.emit();
            });

            this.socket.on('changeHost', (host: boolean) => {
                this.lobby!.host = host;
                this.lobbyChanged.emit();
            });

            this.socket.on('gameStarted', (type: number) =>
                this.loadGame(type),
            );

            this.socket.on('changeGame', (type: number) => {
                this.lobby!.type = type;
                this.lobbyChanged.emit();
            });

            this.socket.on(
                'ready',
                (obj: { userId: string; isReady: boolean }) => {
                    this.lobby!.users.forEach((user) => {
                        if (user.id === obj.userId) {
                            user.ready = obj.isReady;
                        }
                    });
                    this.lobbyChanged.emit();
                },
            );
        });
    }

    postMessage(message: string) {
        this.socket.emit('postMessage', {
            name: this.name,
            message,
        } as ChatMessage);
    }

    setName(name: string) {
        this.name = name;
    }

    getLobbies(): Observable<LobbyInfoSmall[]> {
        this.socket.emit('getLobbies');
        return this.socket.fromEvent<LobbyInfoSmall[]>('lobbies');
    }

    createLobby(lobbyName: string) {
        this.socket.emit('createLobby', {
            userName: this.name,
            lobbyName,
            avatar: this.avatar,
        } as CreateLobbyRequest);
    }

    leaveLobby() {
        this.socket.removeAllListeners('playerJoined');
        this.socket.removeAllListeners('playerLeft');
        this.socket.removeAllListeners('changeHost');
        this.socket.removeAllListeners('gameStarted');

        this.socket.emit('leaveLobby', this.lobby!.id);
        this.titleService.setTitle('Game Board');
        this.lobby = null;
    }

    joinLobby(lobbyId: number) {
        this.socket.emit('joinLobby', {
            userName: this.name,
            lobbyId,
            avatar: this.avatar,
        } as JoinLobbyRequest);
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

        this.titleService.setTitle('Game: ' + this.game.getName());

        this.appService.startTransition(() =>
            this.router.navigate([GameTypes.getGamePath(type)]),
        );
    }

    changeGame(type: number) {
        this.socket.emit('changeGame', type);
    }

    ready(ready: boolean) {
        this.socket.emit('ready', ready);
    }
}
