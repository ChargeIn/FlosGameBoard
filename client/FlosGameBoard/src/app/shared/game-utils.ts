/*
 * Copyright (c) Florian Plesker
 */

import {Socket} from 'ngx-socket-io';

export class GameTypes {

    static WHAT_THE_HECK = 0;

    static getGamePath(type: number) {
        switch (type) {
            case 0:
                return 'what-the-heck';
            default:
                return 'what-the-heck';
        }
    }

    static getName(type: number) {
        switch (type) {
            case 0:
                return 'What the Heck';
            default:
                return 'What the Heck';
        }
    }

    0: 'what-the-heck'
}

export class Game {
    protected socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    endGame(_socket: Socket) {
    }

    howToPlay(): string {
        return '';
    }

    getName(): string {
        return '';
    }
}
