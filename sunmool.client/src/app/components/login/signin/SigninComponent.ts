import { Component, EventEmitter, Output } from '@angular/core';
//import { FORM_DIRECTIVES } from '@angular/forms';

import { AuthService } from '../../../services/Auth/AuthService';

import { Events } from '../../../services/Auth/Events';

@Component({
  selector: 'signin-cmpnt',
  styleUrls: ['./src/app/components/login/signin/Signin.css', './src/app/components/login/Login.css'],
  templateUrl: './src/app/components/login/signin/Signin.html'
  //directives: [FORM_DIRECTIVES]
})
export class SigninComponent {
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();
  public username;
  public password;
  public errorMessage = null;

  public isForgotPassView = false;

  constructor(private auth : AuthService, private events : Events) {
    this.events.loginErrors.subscribe( res => {
      this.errorMessage = res.message;
    });
  }


  changeView(viewNumber) {
    this.notify.emit(viewNumber);
  }

  login() {
    this.auth.login(this.username, this.password);
  }

  loginWithFacebook() {
    this.auth.loginWithFacebook();
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  forgotPasswordView() {
    this.isForgotPassView = !this.isForgotPassView;
  }
}
