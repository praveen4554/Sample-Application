import { Injectable, EventEmitter }             from '@angular/core';


@Injectable()
export class Events {
  public loginErrors : EventEmitter<Object> = new EventEmitter();
  public searchSuccessEvent : EventEmitter<Object> = new EventEmitter();
  public searchFailEvent : EventEmitter<Object> = new EventEmitter();
  public searchStatuslEvent : EventEmitter<Object> = new EventEmitter();


  loginErrorsF (val) {
    this.loginErrors.emit(val);
  }

  searchSuccess (val) {
    console.log("trigger success")
    this.searchSuccessEvent.emit(val);
  }

  searchFail (val) {
    this.searchFailEvent.emit(val);
  }

  toggleSearch (status) {
    this.searchStatuslEvent.emit(status)
  }

}

export const EVENTS_PROVIDER = [
  Events
];
