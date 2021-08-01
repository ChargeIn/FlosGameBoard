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
    // highest, lowest possible number
    @Input() range: [number, number] = [0, 1];

    getStyle() {
        const scoreNormed =
            (this.score - this.range[1]) / (this.range[0] - this.range[1]);
        return `color: rgb(${low[0] + high[0] * scoreNormed},${
            low[1] + high[1] * scoreNormed
        },${low[2] + high[2] * scoreNormed});`;
    }
}
