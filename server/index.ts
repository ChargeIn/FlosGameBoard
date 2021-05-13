/*
 * Copyright (c) Florian Plesker
 */

import {Lobby, LobbyInfo} from './Lobby';
import {JoinLobbyRequest, CreateLobbyRequest, JoinLobbyAck} from './UtilObjects';
import {Socket} from 'socket.io';

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {cors: {origin: "*"}}); // TODO: remove cors allowance on release

// TODO: adjust static file folders
app.use(express.static(path.join(__dirname, '../client/FlosGameBoard/dist/FlosGameBoard')));

const mainChat = [];

const gameRooms: Lobby[] = [];

server.listen(3000, function () {
    console.log("Server started");
});

io.on('connection', socket => {
    mainChat.push(socket);

    socket.on('landingChat', (message) => {
        mainChat.forEach(socket => socket.emit('landingChat', message));
    })

    socket.on('createLobby', (lobbyReq: CreateLobbyRequest) => socket.emit('joinLobby', () => createNewLobby(lobbyReq, socket)));

    socket.on('joinLobby', (joinReq: JoinLobbyRequest) => socket.emit('joinLobby', () => joinLobby(joinReq, socket)));

    socket.on('getLobbies', () => socket.emit('lobbies', { lobbies: getLobbies() } ));
});

function createNewLobby(lobbyReq: CreateLobbyRequest, socket: Socket): JoinLobbyAck {
    const newLobby = new Lobby({name: lobbyReq.user, socket}, lobbyReq.name, this.lobbies.length);
    gameRooms.push(newLobby);

    return {
        users: [lobbyReq.user], lobbyInfo: newLobby.getInfo()
    }
}

function joinLobby(joinReq: JoinLobbyRequest, socket: Socket): JoinLobbyAck {
    const lobby = gameRooms[joinReq.roomId];
    lobby.addUser( { name: joinReq.user, socket});
    const users = lobby.users.map(u => u.name);

    return {users, lobbyInfo: lobby.getInfo()}
}

function getLobbies(): LobbyInfo[] {
    return this.lobbies.map(lobby => lobby.getInfo());
}
