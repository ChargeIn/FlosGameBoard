/*
 * Copyright (c) Florian Plesker
 */

import { Component, Input, OnDestroy } from '@angular/core';
import { ConnectionService } from '../../connection/connection.service';
import { Subject } from 'rxjs';
import { ChatMessage, ChatType } from '../../shared/utils';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnDestroy {
    @Input() messages: ChatMessage[] = [];
    message = '';
    unsubscribe = new Subject<void>();

    constructor(private readonly connection: ConnectionService) {}

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    postMessage() {
        if (this.message.length === 0) {
            return;
        }
        this.connection.postMessage(this.message);
        this.message = '';
    }

    isOwnMessage(type: ChatType) {
        return ChatType.Own === type;
    }

    isNormalMessage(type: ChatType) {
        return ChatType.Normal === type;
    }

    isSystemMessage(type: ChatType) {
        return ChatType.System === type;
    }
}
