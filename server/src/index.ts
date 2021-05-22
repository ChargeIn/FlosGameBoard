/*
 * Copyright (c) Florian Plesker
 */

import {ChatMessage, ChatType, LobbyInfo} from './utlis';
import {CreateLobbyRequest, JoinLobbyRequest} from './request';
import {Socket} from 'socket.io';
import {Lobby} from './lobby';

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
    console.log(lobbyReq.userName + ' created lobby ' + lobbyReq.lobbyName)

    leaveMainChat(socket);

    const newLobby = new Lobby({
        name: lobbyReq.userName,
        socket,
        avatar: lobbyReq.avatar
    }, lobbyReq.lobbyName, lobbies.length);
    lobbies.push(newLobby);

    mainChat.forEach(socket => socket.emit('lobbies', getLobbies(socket)));

    return newLobby.getInfo(socket);
}

function joinLobby(joinReq: JoinLobbyRequest, socket: Socket): LobbyInfo {
    console.log(joinReq.userName + ' joined lobby ' + joinReq.lobbyId);

    leaveMainChat(socket);

    const lobby = lobbies[joinReq.lobbyId];
    lobby.addUser({name: joinReq.userName, socket, avatar: joinReq.avatar});

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

    socket.emit('chat', {name: '', message: 'You have joined the main chat.', type: ChatType.System})

    socket.on('postMessage', (msg: { name: string, message: string }) => {
            console.log(socket.id + ':' + msg.name + ' posted: ' + msg.message);
            mainChat.forEach(user => user.emit('chat', {
                name: msg.name,
                message: msg.message,
                type: socket.id == user.id ? ChatType.Own : ChatType.Normal
            } as ChatMessage));
        }
    )
    mainChat.push(socket);
}

function leaveMainChat(socket: Socket) {
    console.log(socket.id + ' leaves the main chat');
    socket.removeAllListeners('postMessage');
    mainChat = mainChat.filter(s => s.id !== socket.id);
}
