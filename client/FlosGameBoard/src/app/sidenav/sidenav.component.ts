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
import { ChatMessage, LobbyInfoSmall } from '../shared/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavService } from './sidenav.service';

type Tab = 'Chat' | 'HowToPlay' | 'Lobby';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnDestroy {
    lobbies: LobbyInfoSmall[] = [];
    messages: ChatMessage[] = [];
    private unsubscribe = new Subject<void>();
    currentTab: Tab = 'Lobby';

    constructor(
        private readonly connection: ConnectionService,
        private readonly navService: SidenavService,
        private readonly cd: ChangeDetectorRef,
    ) {
        this.connection
            .getLobbies()
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((info) => {
                this.lobbies = info;
                this.cd.markForCheck();
            });

        this.connection.chat
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((msg) => {
                this.messages.push(msg);
                const length = this.messages.length;
                this.messages = this.messages.filter(
                    (_m, i) => length - i < 30,
                );
                this.cd.markForCheck();
            });

        this.navService.onShowLobbies
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => (this.currentTab = 'Lobby'));
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    inGame() {
        return this.connection.game !== null;
    }

    getGameDescription() {
        return this.connection.game?.howToPlay() || 'No description found';
    }

    changeTabs(tab: Tab) {
        this.currentTab = tab;
    }
}
