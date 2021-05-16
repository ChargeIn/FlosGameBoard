/*
 * Copyright (c) Florian Plesker
 */

import {User} from '../../../../../server/src/Lobby';

export interface LobbyInfo {
    id: number,
    name: string
    host: boolean,
    type: number,
    userCount: number,
    users: UserInfo[],
}

export interface UserInfo {
    name: string,
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
    winner: string,
    cards: { user: User, card: number }[]
}
