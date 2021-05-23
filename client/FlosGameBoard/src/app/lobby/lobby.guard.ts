/*
 * Copyright (c) Florian Plesker
 */

import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {ConnectionService} from '../connection/connection.service';

@Injectable()
export class LobbyGuard implements CanActivate {
    constructor(public connection: ConnectionService, private readonly router: Router) {
    }

    canActivate(): boolean {
        if (this.connection.lobby === null) {
            this.router.navigate(['/']);
        }
        return this.connection.lobby !== null;
    }
}
