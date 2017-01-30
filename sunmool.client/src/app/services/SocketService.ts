import { Injectable, EventEmitter }             from '@angular/core';
//import * as io from "socket.io-client"




@Injectable()
export class SocketService {

  private socket;
  public connectedEvent : EventEmitter<Object> = new EventEmitter();
  public disconnectedEvent : EventEmitter<Object> = new EventEmitter();

  constructor () {

  }

  connect() {

    // this.socket = io.connect();
    // let _parent = this;
    //
    // this.socket.on('connected', (user) => {
    //   this.connectedEvent.emit({})
    // })
    //
    // this.socket.on('disconnect', () => {
    //   this.disconnectedEvent.emit({})
    // })
  }

}

export const SOCKET_SERVICE_PROVIDER = [
  SocketService
];
