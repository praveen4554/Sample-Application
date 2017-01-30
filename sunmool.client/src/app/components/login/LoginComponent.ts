import { Component } from '@angular/core';
import { AngularFire, firebaseAuthConfig } from 'angularfire2';

import {AuthService} from "../../services/Auth/AuthService";
import { Router}    from '@angular/router';

import {MainLoginComponent} from './main/MainLoginComponent';
import {SigninComponent} from './signin/SigninComponent';
import {SignupComponent} from './signup/SignupComponent';
import { VariableService } from '../../services/variables';


@Component({
  selector: 'home-cmpnt',
  styleUrls: ['./src/app/components/login/Login.css'],
  templateUrl: './src/app/components/login/Login.html',
  /*directives: [MainLoginComponent, SigninComponent, SignupComponent]*/
})
export class LoginComponent {

  public openedView = 1;


  public queryList;
  public items = [];

  constructor(public af: AngularFire, public auth: AuthService, private router: Router, public configVars : VariableService) {
    this.af.auth.subscribe(auth => {
      if(auth != null) {
        this.router.navigate(['/home/all']);
      }
    });


    this.queryList = this.af.database.list('/items', {
      query: {
        limitToLast: 20,
        orderByKey: true
      }
    })
    this.queryList.subscribe(res => {
      this.items = res;
    });

  }

  login() {

  }


  changeView(viewNumber) {
    this.openedView = viewNumber;
  }
}
