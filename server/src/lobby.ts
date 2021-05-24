/*
 * Copyright (c) Florian Plesker
 */

import {Socket} from 'socket.io';
import {GameFactory} from './game-factory';
import {ChatMessage, ChatType, LobbyInfo, LobbyInfoSmall, User, UserInfo} from './utlis';

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
            u.socket.emit('playerJoined', {id: user.socket.id, name: user.name, avatar: user.avatar} as UserInfo);
            u.socket.emit('chat', {
                name: '',
                message: `Player ${user.name} has joined the lobby`,
                type: ChatType.System,
            } as ChatMessage);
        })

        user.socket.emit('chat', {
            message: `You have joined the lobby ${this.name}.`,
            name: user.name,
            type: ChatType.System
        } as ChatMessage);

        user.socket.on('postMessage', (msg: { name: string, message: string }) => {
            console.log(`${user.socket.id}: ${msg.name} posted: ${msg.message}`);
            this.users.forEach(u => u.socket.emit('chat', {
                name: msg.name,
                message: msg.message,
                type: user.socket.id === u.socket.id ? ChatType.Own : ChatType.Normal
            } as ChatMessage));
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
            users: this.users.map(u => ({name: u.name, id: u.socket.id, avatar: u.avatar})),
        }
    }

    getSmallInfo(): LobbyInfoSmall {
        return {
            id: this.id,
            name: this.name,
            userCount: this.users.length,
        }
    }
}
