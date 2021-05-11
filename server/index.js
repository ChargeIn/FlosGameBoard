const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {cors: {origin: "*"}}); // TODO: remove cors allowance on release

// TODO: adjust static file folders
app.use(express.static(path.join(__dirname, '../client/FlosGameBoard/dist/FlosGameBoard')));

const chat = [];

server.listen(3000, function () {
    console.log("Server started");
});

io.on('connection', socket => {
    chat.push(socket);

    socket.on('landingChat', (message) => {
        chat.forEach(socket => socket.emit('landingChat', message));
    })
});
