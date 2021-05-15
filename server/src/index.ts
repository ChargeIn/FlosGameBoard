/*
 * Copyright (c) Florian Plesker
 */

import {Lobby, LobbyInfo} from './Lobby';
import {CreateLobbyRequest, JoinLobbyAck, JoinLobbyRequest} from './Request';
import {Socket} from 'socket.io';

const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {cors: {origin: '*'}}); // TODO: remove cors allowance on release

// TODO: adjust static file folders
app.use(express.static(path.join(__dirname, '../client/FlosGameBoard/dist/FlosGameBoard')));

const mainChat: Socket[] = [];

let lobbies: Lobby[] = [];

server.listen(3000, function () {
    console.log('Server started');
});

io.on('connection', (socket: Socket) => {
    mainChat.push(socket);

    socket.on('landingChat', (message) => {
        mainChat.forEach(socket => socket.emit('landingChat', message));
    })

    socket.on('createLobby', (lobbyReq: CreateLobbyRequest) => socket.emit('joinLobby', () => createNewLobby(lobbyReq, socket)));

    socket.on('joinLobby', (joinReq: JoinLobbyRequest) => socket.emit('joinLobby', () => joinLobby(joinReq, socket)));

    socket.on('leaveLobby', (id: number) => leaveLobby(id, socket))

    socket.on('getLobbies', () => socket.emit('lobbies', {lobbies: getLobbies()}));
});

function createNewLobby(lobbyReq: CreateLobbyRequest, socket: Socket): JoinLobbyAck {
    console.log(lobbyReq.user + ' created lobby ' + lobbyReq.name)
    const newLobby = new Lobby({name: lobbyReq.user, socket}, lobbyReq.name, lobbies.length);
    lobbies.push(newLobby);

    return {
        users: [lobbyReq.user], lobbyInfo: newLobby.getInfo()
    }
}

function joinLobby(joinReq: JoinLobbyRequest, socket: Socket): JoinLobbyAck {
    console.log(joinReq.user + ' joined lobby ' + joinReq.roomId);
    const lobby = lobbies[joinReq.roomId];
    lobby.addUser({name: joinReq.user, socket});
    const users = lobby.users.map(u => u.name);

    return {users, lobbyInfo: lobby.getInfo()}
}

function getLobbies(): LobbyInfo[] {
    console.log('Get Lobbies: ' + lobbies.length);
    return lobbies.map(lobby => lobby.getInfo());
}


function leaveLobby(id: number, socket: Socket) {
    console.log(socket.id + ' just left the lobby ' + id);
    const lobby = lobbies[id];

    if (lobby.users.length < 2) {
        lobbies = lobbies.filter((l, i) => i != id);
        return;
    }

    lobbies[id].removeUser(socket);
}
