/*
 * Copyright (c) Florian Plesker
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreateLobbyDialogComponent} from './create-lobby-dialog.component';

describe('CreateLobbyDialogComponent', () => {
    let component: CreateLobbyDialogComponent;
    let fixture: ComponentFixture<CreateLobbyDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateLobbyDialogComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateLobbyDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
