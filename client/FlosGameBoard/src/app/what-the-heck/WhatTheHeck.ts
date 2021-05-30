/*
 * Copyright (c) Florian Plesker
 */

import { Observable } from 'rxjs';
import { PlayedCardInfo, RoundWinnerInfo, ScoreInfo } from '../shared/utils';
import { Game } from '../shared/game-utils';
import { WrappedSocket } from '../connection/socket/socket-io.service';

export class WhatTheHeck extends Game {
    cardPlayed: Observable<PlayedCardInfo>;
    nextCard: Observable<number>;
    scores: Observable<ScoreInfo>;
    roundWinner: Observable<RoundWinnerInfo>;
    draw: Observable<void>;

    constructor(socket: WrappedSocket) {
        super(socket);

        this.cardPlayed = socket.fromEvent<PlayedCardInfo>('cardPlayed');
        this.nextCard = socket.fromEvent<number>('nextCard');
        this.scores = socket.fromEvent<ScoreInfo>('endGame');
        this.roundWinner = socket.fromEvent<RoundWinnerInfo>('roundWinner');
        this.draw = socket.fromEvent<void>('draw');
    }

    endGame(socket: WrappedSocket) {
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
        this.socket.emit('removeCard');
    }

    howToPlay(): string {
        return `
            <span>Every player starts with the same set of cards ranging from 1 to 15.</span><br><br>
             
            <span>Every round the system draws a card from a set containing the numbers -5 to 10 without zero.<br><br>
            Afterwards every player has played his card, the cards are reveled and the winner is determined.</span>
            
            If the card in the middle has positive value, the player who played the highest card will win receives a score equal to the number of the drawn card.
            If the card is negative the player with the lowest card will win and receives a the number as penalty.<br><br>
            
            If two or more players play the same card, their value is nullified and they can no longer win the round.<br>
            If all cards are canceled out its a draw and the card in the middle won't change.<br><br>
            
            After all cards are played, the player with the highest score will win.<br><br>
            
            Have fun!
        `;
    }

    getName() {
        return 'What the Heck';
    }
}
