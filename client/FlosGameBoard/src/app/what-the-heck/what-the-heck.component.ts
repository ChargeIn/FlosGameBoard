/*
 * Copyright (c) Florian Plesker
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
} from '@angular/core';
import { ConnectionService } from '../connection/connection.service';
import { WhatTheHeck } from './WhatTheHeck';
import {
    DrawInfo,
    RoundWinnerInfo,
    ScoreInfo,
    UserInfo,
} from '../shared/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-what-the-heck',
    templateUrl: './what-the-heck.component.html',
    styleUrls: ['./what-the-heck.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatTheHeckComponent implements OnDestroy {
    game: WhatTheHeck;
    currentDeck: number[];
    currentCard: number | undefined;
    playedCard: number | null = null;
    players: { user: UserInfo; playedCard: boolean; score: number }[];
    opponents: number[] = [];
    transition = false;

    unsubscribe = new Subject();

    constructor(private connection: ConnectionService, cd: ChangeDetectorRef) {
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

        this.game.nextCard
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((card) => {
                this.currentCard = card;
                cd.markForCheck();
            });
        this.game.draw.subscribe((_drawInfo: DrawInfo) => {
            this.roundFinished();
            cd.markForCheck();
        });
        this.game.cardPlayed.subscribe((cardInfo) => {
            this.players.forEach((player) => {
                if (player.user.id === cardInfo.id) {
                    player.playedCard = cardInfo.played;
                }
            });
            cd.markForCheck();
        });
        this.game.roundWinner
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((winnerInfo: RoundWinnerInfo) => {
                this.players.forEach((p) => {
                    if (p.user.id === winnerInfo.winnerId) {
                        p.score += winnerInfo.points;
                    }
                });
                this.roundFinished();
                cd.markForCheck();
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
            player.playedCard = false;
        });
        this.playedCard = null;
    }
}
