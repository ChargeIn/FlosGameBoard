/*
 * Copyright (c) Florian Plesker
 */

import {User} from './Lobby';

export enum GameType {
    WHAT_THE_HECK = 0,

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
    private cards: { user: User, card: number }[] = [];
    private scores: { [id: string]: number } = {};
    private cardDeck: number[] = [];
    private currentCard: number;
    private cardsPlayed: number = 0;
    private readonly maxCardsPlayable = 14;

    constructor(users: User[]) {
        this.users = users;
        this.generateNewCardDeck();
        this.currentCard = this.cardDeck.pop()!;
        this.users.forEach(u => {
            u.socket.emit('newDeckCard', this.currentCard);
            this.scores[u.socket.id] = 0;
        });

        users.forEach(user => {
            user.socket.on('playCard', (number) => {
                this.cards.push({user, card: number});

                if (this.cards.length === this.users.length) {
                    this.cardsPlayed++;
                    const winner: string | null = this.getWinner();

                    this.users.forEach(u => {
                        u.socket.emit('winner', {winner, cards: this.cards});
                    });


                    if (winner) {
                        this.scores[winner] += this.currentCard;

                        if (this.cardDeck.length > 0 && this.cardsPlayed < this.maxCardsPlayable) {
                            this.currentCard = this.cardDeck.pop()!;
                            this.users.forEach(user => user.socket.emit('nextCard', this.currentCard));
                        } else {
                            this.users.forEach(user => user.socket.emit('roundOver', {scores: this.scores}))
                        }
                    }
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
        this.cardDeck = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1, -2, -3, -4, -5];
        this.cardDeck = this.cardDeck.sort(() => Math.random() - 0.5);
    }

    getWinner(): string | null {
        let cardCounts = Array<number>(this.maxCardsPlayable).fill(0);

        this.cards.forEach(card => cardCounts[card.card]++);
        cardCounts = cardCounts.filter(count => count === 1);

        if (cardCounts.length === 0) {
            return null;
        }

        if (this.currentCard! < 0) {
            let i = 0;

            while (i < this.cards.length) {
                if (cardCounts[i] == 1) {
                    break;
                }
                i++;
            }

            return this.cards.filter(cards => cards.card == i)[0].user.socket.id;
        } else {
            let i = this.cards.length - 1;

            while (i > 0) {
                if (cardCounts[i] == 1) {
                    break;
                }
                i--;
            }

            return this.cards.filter(cards => cards.card == i)[0].user.socket.id;
        }
    }

}
