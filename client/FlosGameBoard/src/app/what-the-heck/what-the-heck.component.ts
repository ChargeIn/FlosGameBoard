/*
 * Copyright (c) Florian Plesker
 */

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
} from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { WhatTheHeck } from './WhatTheHeck';
import { RoundWinnerInfo, ScoreInfo, UserInfo } from '../shared/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-what-the-heck',
    templateUrl: './what-the-heck.component.html',
    styleUrls: ['./what-the-heck.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatTheHeckComponent implements OnDestroy, AfterViewInit {
    game: WhatTheHeck;
    currentDeck: number[];
    currentCard: number | undefined;
    playedCard: number | null = null;
    players: { user: UserInfo; playedCard: number; score: number }[];
    opponents: number[] = [];
    transition = false;

    unsubscribe = new Subject();
    spin = false;

    constructor(
        private connection: ConnectionService,
        private readonly cd: ChangeDetectorRef,
    ) {
        this.currentDeck = Array.from({ length: 15 }, (_, i) => i + 1);
        this.game = this.connection.game as WhatTheHeck;
        this.players = this.connection.lobby!.users.map((u) => ({
            user: u,
            playedCard: -1,
            score: 0,
        }));
        this.players.forEach((p, i) => {
            if (p.user.id !== connection.lobby!.playerId) {
                this.opponents.push(i);
            }
        });

        this.game.nextCard
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((card) => {
                this.currentCard = card;
                cd.markForCheck();
            });

        this.game.cardPlayed.subscribe((cardInfo) => {
            this.players.forEach((player) => {
                if (player.user.id === cardInfo.id) {
                    player.playedCard = 0;
                }
            });
            cd.markForCheck();
        });
        this.game.endRound
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((winnerInfo: RoundWinnerInfo) => {
                this.spin = true;
                cd.markForCheck();

                setTimeout(() => {
                    this.spin = false;
                    if (winnerInfo.winnerId !== '') {
                        this.players.forEach((p) => {
                            if (p.user.id === winnerInfo.winnerId) {
                                p.score += winnerInfo.points;
                            }
                        });
                    }

                    winnerInfo.cards.forEach((card) => {
                        this.players.filter(
                            (p) => p.user.id === card.userId,
                        )![0].playedCard = card.card;
                    });
                    this.showScores();
                    cd.markForCheck();
                }, 1000);
            });
        this.game.scores
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((scoreInfo: ScoreInfo) => {
                this.currentCard = undefined;
                this.transition = true;
                this.players.forEach((player) => {
                    player.score = scoreInfo.scores[player.user.id];
                });
                cd.markForCheck();
            });
    }

    ngAfterViewInit() {
        this.game.ready();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
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
            player.playedCard = -1;
        });
        this.playedCard = null;
        this.cd.markForCheck();
    }

    private showScores() {
        setTimeout(() => this.roundFinished(), 2000);
    }
}
