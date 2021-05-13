/*
 * Copyright (c) Florian Plesker
 */

import {LobbyInfo} from './Lobby';

export interface JoinLobbyRequest {
    user: string,
    roomId: number,
}

export interface CreateLobbyRequest {
    user: string,
    name: string,
}

export interface JoinLobbyAck {
    lobbyInfo: LobbyInfo,
    users: string[],
}
