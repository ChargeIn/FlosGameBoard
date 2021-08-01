/*
 * Copyright (c) Florian Plesker
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

const high = [50, 255, 0];
const low = [255, 60, 0];

@Component({
    selector: 'score',
    templateUrl: 'score.component.html',
    styleUrls: ['score.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
    @Input() score = 0;
    @Input() range: [number, number] = [0, 1];

    getStyle() {
        return `color: rgb(${low[0] + high[0] * ((this.score - 1) / 14)},${
            low[1] + high[1] * ((this.score - 1) / 14)
        },${low[2] + high[2] * ((this.score - 1) / 14)});`;
    }
}
