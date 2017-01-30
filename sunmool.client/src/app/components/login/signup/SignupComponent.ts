import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../services/Auth/AuthService';


import { Events } from '../../../services/Auth/Events';


@Component({
  selector: 'signup-cmpnt',
  styleUrls: ['./src/app/components/login/signup/Signup.css', './src/app/components/login/Login.css'],
  templateUrl: './src/app/components/login/signup/Signup.html',
})
export class SignupComponent {
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

  public username;
  public password;
  public confirmPassword;

  public invalidEmail = false;
  public errorMessage = null;

  constructor(private auth : AuthService, private events : Events) {

    this.events.loginErrors.subscribe( res => {
      this.errorMessage = res.message;
    });
  }
  changeView(viewNumber) {
    this.notify.emit(viewNumber);
  }

  signup() {
    if(this.confirmPassword != this.password) {
      this.errorMessage = "Password must be the same!";
      return;
    }

    this.auth.signup(this.username, this.password);
  }
}
