/*
 * Copyright (c) Florian Plesker
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
} from '@angular/core';
import { ConnectionService } from '../../connection/connection.service';
import { ChatMessage, ChatType } from '../../shared/utils';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ChatComponent {
    @Input() messages: ChatMessage[] = [];
    message = '';

    constructor(
        private readonly connection: ConnectionService,
        private cd: ChangeDetectorRef,
    ) {}

    postMessage() {
        if (this.message.length === 0) {
            return;
        }
        this.connection.postMessage(this.message);
        this.message = '';
        this.cd.markForCheck();
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
