/*
 * Copyright (c) Florian Plesker
 */

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
    name: string;
    avatar: number;
    id: string;
    ready: boolean;
}

export interface PlayedCardInfo {
    id: string;
    played: boolean;
}

export interface ScoreInfo {
    scores: { [id: string]: number };
}

export interface RoundWinnerInfo {
    winnerId: string;
    points: number;
    cards: { userId: string; card: number }[];
}

export interface DrawInfo {
    cards: { user: UserInfo; card: number }[];
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
