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
    mainChat.push(socket);

    socket.on('landingChat', (message) => {
        console.log(socket.id + ' posted: ' + message);
        mainChat.forEach(socket => socket.emit('landingChat', message));
    })

    socket.on('createLobby', (lobbyReq: CreateLobbyRequest) => socket.emit('joinLobby', createNewLobby(lobbyReq, socket)));

    socket.on('joinLobby', (joinReq: JoinLobbyRequest) => socket.emit('joinLobby', joinLobby(joinReq, socket)));

    socket.on('leaveLobby', (id: number) => leaveLobby(id, socket))

    socket.on('getLobbies', () => socket.emit('lobbies', {lobbies: getLobbies()}));

    socket.on('disconnect', () => removeUser(socket));
});

function createNewLobby(lobbyReq: CreateLobbyRequest, socket: Socket): LobbyInfo {
    console.log(lobbyReq.user + ' created lobby ' + lobbyReq.name)

    socket.off('message', () => {
    });

    const newLobby = new Lobby({name: lobbyReq.user, socket}, lobbyReq.name, lobbies.length);
    lobbies.push(newLobby);

    mainChat = mainChat.filter(s => s.id !== socket.id);

    mainChat.forEach(socket => socket.emit('lobbies', {lobbies: getLobbies()}));

    return newLobby.getInfo();
}

function joinLobby(joinReq: JoinLobbyRequest, socket: Socket): LobbyInfo {
    console.log(joinReq.user + ' joined lobby ' + joinReq.lobbyId);

    socket.off('message', () => {
    });

    const lobby = lobbies[joinReq.lobbyId];
    lobby.addUser({name: joinReq.user, socket});
    
    mainChat = mainChat.filter(s => s.id !== socket.id);

    return lobby.getInfo()
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

function removeUser(socket: Socket) {
    console.log('Removing user: ' + socket.id);
    const toRemove: number[] = [];

    lobbies.forEach((lobby, index) => {
        lobby.removeUser(socket);
        if (lobby.users.length === 0) {
            toRemove.push(index);
        }
    });

    toRemove.forEach(i => lobbies = lobbies.filter((_l, j) => j !== i));
}
