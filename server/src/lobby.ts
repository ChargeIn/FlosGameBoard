/*
 * Copyright (c) Florian Plesker
 */

import {Socket} from 'socket.io';
import {GameFactory} from './game-factory';

export interface User {
    socket: Socket,
    name: string,
}

export interface LobbyInfo {
    id: number,
    name: string
    host: boolean,
    type: number,
    playerId: string,
    userCount: number,
    users: UserInfo[],
}

export interface UserInfo {
    id: string,
    name: string
}


export class Lobby {
    users: User[] = [];
    host: number;
    game: number = 0;
    runningGame: any | undefined = undefined;
    name: string;
    id: number;


    constructor(user: User, name: string, id: number) {
        this.host = 0;
        this.name = name;
        this.id = id;
        this.addUser(user);

        this.users[this.host].socket.on('startGame', () => {
            this.users.forEach(u => u.socket.emit('gameStarted', this.game));
            setTimeout(() => this.runningGame = GameFactory.getGame(this.game, this.users), 300)
        })
        this.users[this.host].socket.on('changeGame', (i) => {
            this.game = i;
            this.users.forEach(u => u.socket.emit('changeGame', i));
        });
    }

    addUser(user: User) {
        this.users.forEach(u => {
            u.socket.emit('playerJoined', {id: user.socket.id, name: user.name} as UserInfo);
        })

        user.socket.on('message', (msg) => {
            this.users.forEach(u => u.socket.emit('lobbyMessage', msg));
        })

        this.users.push(user);
    }

    removeUser(socket: Socket) {

        if (this.users[this.host].socket.id === socket.id) {
            this.changeHost(0);
        }

        this.users = this.users.filter(u => u.socket.id !== socket.id);
        this.users.forEach(user => user.socket.emit('playerLeft', socket.id));
        this.runningGame?.setUsers(this.users);
    }

    changeHost(index: number) {
        this.users[this.host].socket.removeAllListeners('changeGame');
        this.users[this.host].socket.removeAllListeners('start');

        this.host = index;
        this.users[this.host].socket.emit('changeHost', true);
    }

    getInfo(socket: Socket): LobbyInfo {
        return {
            id: this.id,
            name: this.name,
            host: this.users[this.host].socket.id === socket.id,
            type: this.game,
            playerId: socket.id,
            userCount: this.users.length,
            users: this.users.map(u => ({name: u.name, id: u.socket.id})),
        }
    }
}
