/*
 * Copyright (c) Florian Plesker
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-credits',
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditsComponent {}
