/*
 * Copyright (c) Florian Plesker
 */

import { User } from './utlis';

export enum GameType {
    WHAT_THE_HECK = 0,
}

export class GameFactory {
    static getGame(i: number, users: User[]): Game {
        switch (i) {
            case GameType.WHAT_THE_HECK:
                return new WhatTheHeck(users);
            default:
                return new WhatTheHeck(users);
        }
    }
}

export interface Game {
    setUsers(users: User[]): void;
}

export class WhatTheHeck implements Game {
    private users: User[];
    private cards: { user: User; card: number }[] = [];
    private scores: { [id: string]: number } = {};
    private cardDeck: number[] = [];
    private currentCard: number;
    private cardsPlayed = 0;
    private readonly maxCardsPlayable = 15;

    constructor(users: User[]) {
        this.users = users;
        this.generateNewCardDeck();
        this.currentCard = this.cardDeck.pop()!;
        this.users.forEach((u) => {
            u.socket.emit('nextCard', this.currentCard);
            this.scores[u.socket.id] = 0;
        });

        users.forEach((user) => {
            user.socket.on('playCard', (num: number) => {
                console.log(user.socket.id + ' played card ' + num);
                this.cards.push({ user, card: num });

                if (this.cards.length === this.users.length) {
                    this.cardsPlayed++;
                    const winner: string | null = this.getWinner();
                    const playedCards = this.cards.map((c) => ({
                        card: c.card,
                        userId: c.user.socket.id,
                    }));

                    if (winner) {
                        console.log(winner + ' is the winner of round');
                        this.users.forEach((u) => {
                            u.socket.emit('endRound', {
                                winnerId: winner,
                                points: this.currentCard,
                                cards: playedCards,
                            });
                        });
                        this.scores[winner] += this.currentCard;
                        if (
                            this.cardDeck.length > 0 &&
                            this.cardsPlayed < this.maxCardsPlayable
                        ) {
                            this.currentCard = this.cardDeck.pop()!;
                            this.users.forEach((usr) =>
                                usr.socket.emit('nextCard', this.currentCard),
                            );
                        } else {
                            console.log('Game Ended: ' + this.scores);
                            this.users.forEach((usr) =>
                                usr.socket.emit('endGame', {
                                    scores: this.scores,
                                }),
                            );
                        }
                    } else {
                        if (this.cardsPlayed < this.maxCardsPlayable) {
                            console.log(
                                'Draw:' + this.cards.map((c) => c.card),
                            );
                            this.users.forEach((usr) =>
                                usr.socket.emit('endRound', {
                                    winnerId: '',
                                    points: this.currentCard,
                                    cards: playedCards,
                                }),
                            );
                        } else {
                            console.log('Game Ended: ' + this.scores);
                            this.users.forEach((usr) =>
                                usr.socket.emit('endGame', {
                                    scores: this.scores,
                                }),
                            );
                        }
                    }

                    this.cards = [];
                } else {
                    this.users.forEach((u) => {
                        u.socket.emit('cardPlayed', {
                            id: user.socket.id,
                            played: true,
                        });
                    });
                }
            });

            user.socket.on('removeCard', () => {
                this.cards = this.cards.filter(
                    (c) => c.user.socket.id !== user.socket.id,
                );
                this.users.forEach((u) => {
                    u.socket.emit('cardPlayed', {
                        id: user.socket.id,
                        played: false,
                    });
                });
            });
        });
    }

    generateNewCardDeck(): void {
        this.cardDeck = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, -1, -2, -3, -4, -5];
        this.cardDeck = this.cardDeck.sort(() => Math.random() - 0.5);
    }

    getWinner(): string | null {
        const cardCounts = Array<number>(this.maxCardsPlayable).fill(0);

        this.cards.forEach((card) => cardCounts[card.card]++);

        if (cardCounts.findIndex((count) => count === 1) < 0) {
            return null;
        }

        if (this.currentCard! > 0) {
            let i = 0;

            while (i < cardCounts.length) {
                if (cardCounts[i] === 1) {
                    break;
                }
                i++;
            }

            return this.cards.filter((cards) => cards.card === i)[0].user.socket
                .id;
        } else {
            let i = cardCounts.length - 1;

            while (i > -1) {
                if (cardCounts[i] === 1) {
                    break;
                }
                i--;
            }

            return this.cards.filter((cards) => cards.card === i)[0].user.socket
                .id;
        }
    }

    setUsers(users: User[]): void {
        this.users = users;
    }

    end(): void {
        this.users.forEach((usr) => {
            usr.socket.removeAllListeners('playCard');
            usr.socket.removeAllListeners('removeCard');
        });
    }
}
