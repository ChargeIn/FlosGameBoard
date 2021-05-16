/*
 * Copyright (c) Florian Plesker
 */

import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {ConnectionService} from '../connection/connection.service';
import {GameTypes} from '../shared/game-utils';

@Injectable()
export class WhatTheHeckGuard implements CanActivate {
    constructor(public connection: ConnectionService) {
    }

    canActivate(): boolean {
        return this.connection.lobby !== null && this.connection.lobby.type === GameTypes.WHAT_THE_HECK;
    }
}
