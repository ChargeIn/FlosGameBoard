/*
 * Copyright (c) Florian Plesker
 */

export interface LobbyInfo {
    id: number,
    name: string
    host: boolean,
    type: number,
    playerId: string,
    userCount: number,
    users: UserInfo[],
}

export interface LobbyInfoSmall {
    id: number,
    name: string,
    userCount: number,
}

export interface UserInfo {
    name: string,
    avatar: number,
    id: string,
}

export interface PlayedCardInfo {
    id: string,
    value: number,
}

export interface ScoreInfo {
    scores: { [id: string]: number }
}

export interface RoundWinnerInfo {
    winnerId: string,
    points: number,
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
