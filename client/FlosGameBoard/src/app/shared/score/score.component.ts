/*
 * Copyright (c) Florian Plesker
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

const high = [50, 255, 0];
const low = [255, 60, 0];

@Component({
    selector: 'score',
    template: '<div class="score" [style]="getStyle()">{{score}}</div>',
    styles: [
        `
            .score {
                font-weight: 500;
                font-size: 18px;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreComponent {
    @Input() score = 0;
    // highest, lowest possible number
    @Input() range: [number, number] = [0, 1];

    getStyle() {
        if (this.score === 0) {
            return 'color: rgb(255,255,255);';
        }
        const scoreNormed =
            (this.score - this.range[1]) / (this.range[0] - this.range[1]);
        console.log(scoreNormed);
        return `color: rgb(${
            low[0] * (1 - scoreNormed) + high[0] * scoreNormed
        },${low[1] * (1 - scoreNormed) + high[1] * scoreNormed},${
            low[2] * (1 - scoreNormed) + high[2] * scoreNormed
        });`;
    }
}
