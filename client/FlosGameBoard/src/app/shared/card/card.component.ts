/*
 * Copyright (c) Florian Plesker
 */

import {Component, Input, OnInit} from '@angular/core';

const low = [72, 151, 177];
const high = [181, -142, -168]; // aimed at 253, 9, 9

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {


    @Input('value') value: number = 0;

    constructor() {
    }

    ngOnInit(): void {
    }

    getStyle() {
        return `background-color: rgb(${low[0] + high[0] * ((this.value - 1) / 14)},${low[1] + high[1] * ((this.value - 1) / 14)},${low[2] + high[2] * ((this.value - 1) / 14)});`
    }
}
