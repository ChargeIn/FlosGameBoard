/*
 * Copyright (c) Florian Plesker
 */

import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {ConnectionService} from '../connection/connection.service';

@Injectable()
export class LobbyGuard implements CanActivate {
    constructor(public connection: ConnectionService) {
    }

    canActivate(): boolean {
        return this.connection.lobby !== null;
    }
}
