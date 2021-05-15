import {Component, OnInit} from '@angular/core';
import {ConnectionService} from '../connection/connection.service';
import {LobbyInfo} from '../shared/utils';

@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

    lobbyInfo: LobbyInfo;

    constructor(public connection: ConnectionService) {
        console.log(connection.lobby);
        this.lobbyInfo = connection.lobby!;
    }

    ngOnInit(): void {
    }

}
