import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../services/Auth/AuthService';
@Component({
  selector: 'main-login-cmpnt',
  styleUrls: ['./src/app/components/login/main/MainLogin.css', './src/app/components/login/Login.css'],
  templateUrl: './src/app/components/login/main/MainLogin.html',
})
export class MainLoginComponent {
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

  constructor(private auth : AuthService) {

  }
  changeView(viewNumber) {
    this.notify.emit(viewNumber);
  }

  loginWithFacebook() {
    this.auth.loginWithFacebook();
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }


}
