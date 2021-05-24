/*
 * Copyright (c) Florian Plesker
 */

import {ChatMessage, ChatType, LobbyInfo, LobbyInfoSmall} from './utlis';
import {CreateLobbyRequest, JoinLobbyRequest} from './request';
import {Socket} from 'socket.io';
import {Lobby} from './lobby';
import {throttle} from 'rxjs/operators';
import {interval, Subject} from 'rxjs';

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
let updateLobbies = new Subject<void>();

server.listen(3000, function () {
    console.log('Server started');
});

updateLobbies.pipe(throttle(() => interval(1000))).subscribe(() => mainChat.forEach(socket => socket.emit('lobbies', getLobbies()))
)

io.on('connection', (socket: Socket) => {
    joinMainChat(socket);

    socket.on('createLobby', (lobbyReq: CreateLobbyRequest) => socket.emit('joinLobby', createNewLobby(lobbyReq, socket)));

    socket.on('joinLobby', (joinReq: JoinLobbyRequest) => socket.emit('joinLobby', joinLobby(joinReq, socket)));

    socket.on('leaveLobby', (id: number) => leaveLobby(id, socket))

    socket.on('getLobbies', () => socket.emit('lobbies', getLobbies()));

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

    updateLobbies.next();

    return newLobby.getInfo(socket);
}

function joinLobby(joinReq: JoinLobbyRequest, socket: Socket): LobbyInfo {

    if (lobbies[joinReq.lobbyId].users.length > 4) {
        return;
    }

    console.log(joinReq.userName + ' joined lobby ' + joinReq.lobbyId);

    leaveMainChat(socket);

    const lobby = lobbies[joinReq.lobbyId];
    lobby.addUser({name: joinReq.userName, socket, avatar: joinReq.avatar});
    updateLobbies.next();

    return lobby.getInfo(socket)
}

function getLobbies(): LobbyInfoSmall[] {
    console.log('Get Lobbies: ' + lobbies.length);
    return lobbies.map(lobby => lobby.getSmallInfo());
}

function leaveLobby(id: number, socket: Socket) {
    console.log(socket.id + ' just left the lobby ' + id);
    const lobby = lobbies[id];

    joinMainChat(socket);

    if (lobby.users.length < 2) {
        lobbies = lobbies.filter((l, i) => i !== id);
        updateLobbies.next();
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
    lobbies = lobbies.filter((_l, i) => toRemove.findIndex((j) => i === j) === -1);
    updateLobbies.next();
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
