/*
 * Copyright (c) Florian Plesker
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AppService {
    transition = new Subject<void>();

    startTransition(callback: () => void) {
        this.transition.next();
        setTimeout(() => callback(), 500);
    }
}
