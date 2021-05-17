/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnInit} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {WhatTheHeck} from './WhatTheHeck';
import {RoundWinnerInfo, ScoreInfo, UserInfo} from '../shared/utils';

@Component({
    selector: 'app-what-the-heck',
    templateUrl: './what-the-heck.component.html',
    styleUrls: ['./what-the-heck.component.scss']
})
export class WhatTheHeckComponent implements OnInit {

    game: WhatTheHeck;
    currentDeck: number[];
    currentCard: number | undefined;
    playedCard: number | null = null;
    players: { user: UserInfo, playedCard: number | null, score: number }[];
    opponents: number[] = [];

    constructor(private connection: ConnectionService) {
        this.currentDeck = Array.from({length: 15}, (_, i) => i + 1);
        this.game = this.connection.game as WhatTheHeck;
        this.players = this.connection.lobby!.users.map(u => ({user: u, playedCard: null, score: 0}));
        this.players.forEach((p, i) => {
            if (p.user.id !== connection.lobby!.playerId) {
                this.opponents.push(i);
            }
        });

        this.game.nextCard.subscribe(card => this.currentCard = card);
        this.game.draw.subscribe(() => this.playedCard = null);
        this.game.removedCard.subscribe(id => {
            this.players.forEach(player => {
                if (player.user.id === id) {
                    player.playedCard = null;
                }
            });
        });
        this.game.roundWinner.subscribe((winnerInfo: RoundWinnerInfo) => {
            this.playedCard = null;
            this.players.forEach(p => {
                if (p.user.id === winnerInfo.winnerId) {
                    p.score += winnerInfo.points;
                }
            })
        })
        this.game.scores.subscribe((scoreInfo: ScoreInfo) => {
            this.currentCard = undefined;
            this.players.forEach(player => {
                player.score = scoreInfo.scores[player.user.id];
            })
        })
    }

    ngOnInit(): void {
    }

    playCard(card: number) {
        if (this.playedCard) {
            return
        }

        this.playedCard = card;
        this.game.playCard(card);
        this.currentDeck = this.currentDeck.filter(c => c !== card);
    }
}
