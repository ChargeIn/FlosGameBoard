/*
 * Copyright (c) Florian Plesker
 */

import { Injectable } from '@angular/core';
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

  constructor(
    private socket: WrappedSocket,
    private readonly router: Router,
    private titleService: Title,
    private readonly sideNav: SidenavService
  ) {
    socket.connect();
    this.chat = this.socket.fromEvent('chat');

    this.socket.on('joinLobby', (lobbyAck: LobbyInfo) => {
      this.sideNav.close();
      this.titleService.setTitle('Lobby: ' + lobbyAck.name);
      this.socket.removeAllListeners('landingPage');
      this.lobby = lobbyAck;
      this.router.navigate(['lobby']);

      this.socket.on('playerJoined', (userInfo: UserInfo) => {
        this.lobby!.userCount!++;
        this.lobby!.users.push(userInfo);
      });

      this.socket.on('playerLeft', (id: string) => {
        this.lobby!.userCount--;
        this.lobby!.users = this.lobby!.users.filter((user) => user.id !== id);
      });

      this.socket.on(
        'changeHost',
        (host: boolean) => (this.lobby!.host = host)
      );

      this.socket.on('gameStarted', (type: number) => this.loadGame(type));

      this.socket.on('changeGame', (type: number) => {
        console.log(type);
        this.lobby!.type = type;
      });
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

    this.router.navigate([GameTypes.getGamePath(type)]);
  }

  changeGame(type: number) {
    this.socket.emit('changeGame', type);
  }
}
