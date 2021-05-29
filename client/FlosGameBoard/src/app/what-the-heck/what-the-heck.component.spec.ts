/*
 * Copyright (c) Florian Plesker
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatTheHeckComponent } from './what-the-heck.component';

describe('WhatTheHeckComponent', () => {
    let component: WhatTheHeckComponent;
    let fixture: ComponentFixture<WhatTheHeckComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WhatTheHeckComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WhatTheHeckComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
