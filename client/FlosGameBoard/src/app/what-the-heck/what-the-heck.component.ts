/*
 * Copyright (c) Florian Plesker
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { WhatTheHeck } from './WhatTheHeck';
import {
    DrawInfo,
    RoundWinnerInfo,
    ScoreInfo,
    UserInfo,
} from '../shared/utils';

@Component({
    selector: 'app-what-the-heck',
    templateUrl: './what-the-heck.component.html',
    styleUrls: ['./what-the-heck.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatTheHeckComponent {
    game: WhatTheHeck;
    currentDeck: number[];
    currentCard: number | undefined;
    playedCard: number | null = null;
    players: { user: UserInfo; playedCard: boolean; score: number }[];
    opponents: number[] = [];
    transition = true;

    constructor(private connection: ConnectionService) {
        this.currentDeck = Array.from({ length: 15 }, (_, i) => i + 1);
        this.game = this.connection.game as WhatTheHeck;
        this.players = this.connection.lobby!.users.map((u) => ({
            user: u,
            playedCard: false,
            score: 0,
        }));
        this.players.forEach((p, i) => {
            if (p.user.id !== connection.lobby!.playerId) {
                this.opponents.push(i);
            }
        });

        this.game.nextCard.subscribe((card) => (this.currentCard = card));
        this.game.draw.subscribe((_drawInfo: DrawInfo) => {
            this.roundFinished();
        });
        this.game.cardPlayed.subscribe((cardInfo) => {
            this.players.forEach((player) => {
                if (player.user.id === cardInfo.id) {
                    player.playedCard = cardInfo.played;
                }
            });
        });
        this.game.roundWinner.subscribe((winnerInfo: RoundWinnerInfo) => {
            this.players.forEach((p) => {
                if (p.user.id === winnerInfo.winnerId) {
                    p.score += winnerInfo.points;
                }
            });
            this.roundFinished();
        });
        this.game.scores.subscribe((scoreInfo: ScoreInfo) => {
            this.currentCard = undefined;
            this.players.forEach((player) => {
                player.score = scoreInfo.scores[player.user.id];
            });
        });
    }

    playCard(card: number) {
        if (this.playedCard) {
            return;
        }

        this.playedCard = card;
        this.game.playCard(card);
        this.currentDeck = this.currentDeck.filter((c) => c !== card);
    }

    roundFinished() {
        this.players.forEach((player) => {
            player.playedCard = false;
        });
        this.playedCard = null;
    }
}
