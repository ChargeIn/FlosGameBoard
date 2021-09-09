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
import { LobbyInfo } from '../shared/utils';
import { Router } from '@angular/router';
import { GameTypes } from '../shared/game-utils';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppService } from '../app.service';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LobbyComponent implements OnDestroy {
    lobbyInfo: LobbyInfo;
    isReady = false;

    private unsubscribe = new Subject();

    constructor(
        private readonly connection: ConnectionService,
        private readonly appService: AppService,
        private readonly router: Router,
        cd: ChangeDetectorRef,
    ) {
        this.connection.lobbyChanged
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => cd.markForCheck());
        this.lobbyInfo = connection.lobby!;
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    start() {
        this.connection.startGame(this.lobbyInfo.type);
    }

    leaveLobby() {
        this.connection.leaveLobby();
        this.appService.startTransition(() => this.router.navigate(['/']));
    }

    onGameChange(type: number) {
        this.connection.changeGame(type);
    }

    getGame() {
        return GameTypes.getName(this.lobbyInfo.type);
    }

    ready() {
        this.isReady = !this.isReady;
        this.connection.ready(this.isReady);
    }
}
