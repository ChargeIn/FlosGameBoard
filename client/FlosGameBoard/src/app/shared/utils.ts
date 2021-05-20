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
