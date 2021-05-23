/*
 * Copyright (c) Florian Plesker
 */

import {Socket} from 'socket.io';

export interface User {
    socket: Socket,
    name: string,
    avatar: number,
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
    avatar: number,
    name: string
}

export interface ChatMessage {
    name: string,
    message: string,
    type: ChatType
}

export enum ChatType {
    System,
    Own,
    Normal
}