import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConnectionService {

    landingChat: Observable<string>;

    constructor(private socket: Socket) {
        socket.connect();

        this.landingChat = this.socket.fromEvent('landingChat');
    }

    stop(namespace: string) {
        this.socket.removeListener(namespace);
    }

    postMessage(message: string) {
        this.socket.emit('landingChat', message);
    }
}
