/*
 * Copyright (c) Florian Plesker
 */

import {WrappedSocket} from '../connection/socket/socket-io.service';

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
    protected socket: WrappedSocket;

    constructor(socket: WrappedSocket) {
        this.socket = socket;
    }

    endGame(_socket: WrappedSocket) {
    }

    howToPlay(): string {
        return '';
    }

    getName(): string {
        return '';
    }
}
