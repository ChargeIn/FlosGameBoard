/*
 * Copyright (c) Florian Plesker
 */

import {Lobby, LobbyInfo} from './Lobby';
import {CreateLobbyRequest, JoinLobbyRequest} from './Request';
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

let mainChat: Socket[] = [];

let lobbies: Lobby[] = [];

server.listen(3000, function () {
    console.log('Server started');
});

io.on('connection', (socket: Socket) => {
    joinMainChat(socket);

    socket.on('createLobby', (lobbyReq: CreateLobbyRequest) => socket.emit('joinLobby', createNewLobby(lobbyReq, socket)));

    socket.on('joinLobby', (joinReq: JoinLobbyRequest) => socket.emit('joinLobby', joinLobby(joinReq, socket)));

    socket.on('leaveLobby', (id: number) => leaveLobby(id, socket))

    socket.on('getLobbies', () => socket.emit('lobbies', getLobbies(socket)));

    socket.on('disconnect', () => removeUser(socket));
});

function createNewLobby(lobbyReq: CreateLobbyRequest, socket: Socket): LobbyInfo {
    console.log(lobbyReq.user + ' created lobby ' + lobbyReq.name)

    const newLobby = new Lobby({name: lobbyReq.user, socket}, lobbyReq.name, lobbies.length);
    lobbies.push(newLobby);

    leaveMainChat(socket);

    mainChat.forEach(socket => socket.emit('lobbies', getLobbies(socket)));

    return newLobby.getInfo(socket);
}

function joinLobby(joinReq: JoinLobbyRequest, socket: Socket): LobbyInfo {
    console.log(joinReq.user + ' joined lobby ' + joinReq.lobbyId);

    const lobby = lobbies[joinReq.lobbyId];
    lobby.addUser({name: joinReq.user, socket});

    leaveMainChat(socket);

    return lobby.getInfo(socket)
}

function getLobbies(socket: Socket): LobbyInfo[] {
    console.log('Get Lobbies: ' + lobbies.length);
    return lobbies.map(lobby => lobby.getInfo(socket));
}


function leaveLobby(id: number, socket: Socket) {
    console.log(socket.id + ' just left the lobby ' + id);
    const lobby = lobbies[id];

    joinMainChat(socket);

    if (lobby.users.length < 2) {
        lobbies = lobbies.filter((l, i) => i !== id);
        mainChat.forEach(socket => socket.emit('lobbies', getLobbies(socket)));
        return;
    }

    lobbies[id].removeUser(socket);
}

function removeUser(socket: Socket) {
    console.log('Removing user: ' + socket.id);
    const toRemove: number[] = [];

    lobbies.forEach((lobby, index) => {
        lobby.removeUser(socket);
        if (lobby.users.length === 0) {
            toRemove.push(index);
        }
    });

    socket.removeAllListeners();

    leaveMainChat(socket);

    toRemove.forEach(i => lobbies = lobbies.filter((_l, j) => j !== i));
}

function joinMainChat(socket: Socket) {
    console.log(socket.id + ' joins the main chat');

    socket.on('landingChat', (message) => {
        console.log(socket.id + ' posted: ' + message);
        mainChat.forEach(socket => socket.emit('landingChat', message));
    })
    mainChat.push(socket);
}

function leaveMainChat(socket: Socket) {
    console.log(socket.id + ' leaves the main chat');
    socket.removeAllListeners('landingChat');
    mainChat = mainChat.filter(s => s.id !== socket.id);
}
