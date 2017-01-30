// Sunmool3 - 2017 build
// =====================
// App components


import { Component } from "@angular/core";
import { NavComponent } from './components/nav/NavComponent';
import { AuthService } from './services/Auth/AuthService';
import { AngularFire  } from 'angularfire2';
import { typings } from "typings";

@Component({
  selector: 'chat-spot',
  template: `
    <div [ngClass]="{'body' : ! opened, 'overflow': !isLoggedIn || opened}">
    <nav-cmpnt *ngIf="isLoggedIn" (notify)="changeOpened($event)"></nav-cmpnt>
    <div [ngClass]="{'is-opend overflow' : opened}">
    <router-outlet> </router-outlet>
    </div>
    </div>
  `
  })
  /*
  ,
  directives: [NavComponent, ROUTER_DIRECTIVES]
})*/

export class SunmoolApp {
  public isLoggedIn = false;
  public opened = false;
  constructor(private auth : AuthService, private af : AngularFire) {
    this.af.auth.subscribe(auth => {
      if(auth != null) {
        this.isLoggedIn = true;
      }else{
        this.isLoggedIn = false;
      }
    });
  }

  changeOpened(val) {
    this.opened = val;
  }
}
