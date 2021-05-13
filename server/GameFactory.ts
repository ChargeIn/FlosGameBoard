/*
 * Copyright (c) Florian Plesker
 */

import {User} from './Lobby';

export enum GameType {
    WHAT_THE_HECK= 0,

}

export class GameFactory {
    static getGame(i: number, users: User[]) {
        switch (i) {
            case GameType.WHAT_THE_HECK:
                return new WhatTheHeck(users);
            default:
                return new WhatTheHeck(users);
        }
    }
}

export class WhatTheHeck {
    private users: User[];
    private cards: {user: User, card: number}[] = [];
    private cardDeck: number[];
    private currentCard: number;

    constructor(users: User[]) {
        this.users = users;
        this.generateNewCardDeck();
        this.currentCard = this.cardDeck.pop();

        users.forEach(user => {
            user.socket.on('playCard', (number) => {
                this.cards.push({user, card: number});

                if(this.cards.length === this.users.length) {
                    const winner = this.getWinner();

                    this.users.forEach(u => {
                        u.socket.emit('winner', { winner, cards: this.cards});
                    })
                } else {
                    this.users.forEach(u => {
                        u.socket.emit('cardPlayed', (user.socket.id))
                    });
                }
            });

            user.socket.on('removeCard', () => {
                this.cards = this.cards.filter(c => c.user.socket.id != user.socket.id);
            });
        })
    }

    generateNewCardDeck() {
        this.cardDeck = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1, -2, -3, -4 , -5];
        this.cardDeck = this.cardDeck.sort(() => Math.random() - 0.5)
    }

    getWinner() {
        let winner;

        if(this.currentCard < 0) {
            winner = this.cards.reduce((p, c ) => (p.card < c.card) ? p : c);
        } else {
            winner = this.cards.reduce((p, c ) => (p.card > c.card) ? p : c);
        }

        return winner.user.socket.id;
    }

}
