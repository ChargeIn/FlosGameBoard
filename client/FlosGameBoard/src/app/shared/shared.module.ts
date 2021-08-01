/*
 * Copyright (c) Florian Plesker
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { ScoreComponent } from './score/score.component';

@NgModule({
    declarations: [CardComponent, ScoreComponent],
    imports: [CommonModule],
    exports: [CardComponent, ScoreComponent, CommonModule],
})
export class SharedModule {}
