/*
 * Copyright (c) Florian Plesker
 */

import {Socket} from 'socket.io';
import {GameFactory} from './GameFactory';

export interface User {
    socket: Socket,
    name: string,
}

export interface LobbyInfo {
    id: number,
    name: string
    host: string,
    type: number,
    userCount: number,
}



export class Lobby {
    users: User[] = [];
    host: User;
    game: number;
    name: string;
    id: number;


    constructor(user:User, name: string, id: number) {
        this.host = user;
        this.name = name;
        this.id = id;
        this.addUser(user);

        this.host.socket.on('start', () => GameFactory.getGame(this.game, this.users))
        this.host.socket.on('changeGame', (i) => this.game = i);
    }

    addUser(user: User) {
        this.users.forEach(u => {
            u.socket.emit('playerJoined', {id: user.socket.id, name: user.name});
        })

        this.users.push(user);
    }

    removeUser(socket: Socket) {
        this.users = this.users.filter(s => s.socket.id !== socket.id);

        if(this.users[0]?.socket.id !== this.host.socket.id) {
            this.changeHost(1);
        }
    }

    isEmpty() {
        return this.users.length === 0
    }

    changeHost(index: number) {
        this.host.socket.off('changeGame', () => {});
        this.host.socket.off('start', () => {});

        this.host = this.users[index];
    }

    getInfo(): LobbyInfo {
        return {id: this.id, name: this.name, host: this.host.name, type: this.game, userCount: this.users.length}
    }
}
