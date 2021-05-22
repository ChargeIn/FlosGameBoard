/*
 * Copyright (c) Florian Plesker
 */

import {Component, OnDestroy} from '@angular/core';
import {ConnectionService} from '../../connection/connection.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ChatMessage, ChatType} from '../../shared/utils';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnDestroy {

    messages: ChatMessage[] = [];
    message = '';
    unsubscribe = new Subject<void>();

    constructor(private readonly connection: ConnectionService) {
        this.connection.chat.pipe(takeUntil(this.unsubscribe)).subscribe(msg => {
            this.messages.push(msg);
            const length = this.messages.length;
            this.messages = this.messages.filter((_m, i) => length - i < 30);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }


    postMessage() {
        this.connection.postMessage(this.message);
        this.message = '';
    }

    isOwnMessage(type: ChatType) {
        return ChatType.Own === type;
    }

    isNormalMessage(type: ChatType) {
        return ChatType.Normal === type;
    }

    keyDown($event: KeyboardEvent) {
        console.log($event)
    }
}
