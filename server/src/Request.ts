/*
 * Copyright (c) Florian Plesker
 */

export interface JoinLobbyRequest {
    user: string,
    lobbyId: number,
}

export interface CreateLobbyRequest {
    user: string,
    name: string,
}
