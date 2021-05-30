/*
 * Copyright (c) Florian Plesker
 */

import { Socket } from 'socket.io';

export interface User {
    socket: Socket;
    name: string;
    avatar: number;
    ready: boolean;
}

export interface LobbyInfo {
    id: number;
    name: string;
    host: boolean;
    type: number;
    playerId: string;
    userCount: number;
    users: UserInfo[];
}

export interface LobbyInfoSmall {
    id: number;
    name: string;
    userCount: number;
}

export interface UserInfo {
    id: string;
    avatar: number;
    name: string;
    ready: boolean;
}

export interface ChatMessage {
    name: string;
    message: string;
    type: ChatType;
}

export enum ChatType {
    System,
    Own,
    Normal,
}
