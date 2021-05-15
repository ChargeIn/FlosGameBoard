/*
 * Copyright (c) Florian Plesker
 */

export interface JoinLobbyRequest {
    user: string,
    roomId: number,
}

export interface CreateLobbyRequest {
    user: string,
    name: string,
}
