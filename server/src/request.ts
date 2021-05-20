/*
 * Copyright (c) Florian Plesker
 */

export interface JoinLobbyRequest {
    userName: string,
    avatar: number,
    lobbyId: number,
}

export interface CreateLobbyRequest {
    userName: string,
    avatar: number,
    lobbyName: string,
}
