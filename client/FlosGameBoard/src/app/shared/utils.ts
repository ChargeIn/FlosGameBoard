/*
 * Copyright (c) Florian Plesker
 */

export interface LobbyInfo {
    id: number,
    name: string
    host: string,
    type: number,
    userCount: number,
    users: UserInfo[],
}

export interface UserInfo {
    name: string,
    id: string,
}
