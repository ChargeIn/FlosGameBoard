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
        this.scores = socket.fromEvent<ScoreInfo>('roundOver');
        this.removedCard = socket.fromEvent<string>('removedCard');
        this.roundWinner = socket.fromEvent<RoundWinnerInfo>('winner');
        this.draw = socket.fromEvent<void>('draw');
    }

    endGame(socket: Socket) {
        socket.removeAllListeners('cardPlayed');
        socket.removeAllListeners('nextCard');
        socket.removeAllListeners('roundOver');
        socket.removeAllListeners('removedCard');
        socket.removeAllListeners('winner');
        socket.removeAllListeners('draw');
    }

    playCard(i: number) {
        this.socket.emit('playCard', i);
    }

    removeCard() {
        this.socket.emit('removeCard')
    }
}
