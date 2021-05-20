/*
 * Copyright (c) Florian Plesker
 */

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-create-lobby-dialog',
    templateUrl: './create-lobby-dialog.component.html',
    styleUrls: ['./create-lobby-dialog.component.scss']
})
export class CreateLobbyDialogComponent implements OnInit {

    lobbyName: string = '';

    constructor(
        public dialogRef: MatDialogRef<CreateLobbyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { connection: any }) {
    }

    ngOnInit(): void {
    }

    close() {
        this.dialogRef.close();
    }

    createLobby() {
        this.data.connection.createLobby(this.lobbyName)
        this.dialogRef.close();
    }

    setName(value: string) {
        this.lobbyName = value.substr(0, 25);
    }
}
