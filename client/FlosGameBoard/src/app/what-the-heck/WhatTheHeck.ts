/*
 * Copyright (c) Florian Plesker
 */

import {Observable} from 'rxjs';
import {PlayedCardInfo, RoundWinnerInfo, ScoreInfo} from '../shared/utils';
import {Socket} from 'ngx-socket-io';
import {Game} from '../shared/game-utils';

export class WhatTheHeck extends Game {

    cardPlayed: Observable<PlayedCardInfo>;
    nextCard: Observable<number>;
    scores: Observable<ScoreInfo>;
    removedCard: Observable<string>;
    roundWinner: Observable<RoundWinnerInfo>;
    draw: Observable<void>;

    constructor(socket: Socket) {
        super(socket);

        this.cardPlayed = socket.fromEvent<PlayedCardInfo>('cardPlayed');
        this.nextCard = socket.fromEvent<number>('nextCard');
        this.scores = socket.fromEvent<ScoreInfo>('endGame');
        this.removedCard = socket.fromEvent<string>('cardRemoved');
        this.roundWinner = socket.fromEvent<RoundWinnerInfo>('roundWinner');
        this.draw = socket.fromEvent<void>('draw');
    }

    endGame(socket: Socket) {
        socket.removeAllListeners('cardPlayed');
        socket.removeAllListeners('cardRemoved');
        socket.removeAllListeners('nextCard');
        socket.removeAllListeners('roundWinner');
        socket.removeAllListeners('endGame');
    }

    playCard(i: number) {
        this.socket.emit('playCard', i);
    }

    removeCard() {
        this.socket.emit('removeCard')
    }
}
