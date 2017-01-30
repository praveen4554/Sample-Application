import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Router}    from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Events}    from './Events';
import { VariableService } from '../variables';


import { AngularFire, AuthProviders, AuthMethods, FIREBASE_PROVIDERS, FirebaseAuthState, AngularFireAuth } from 'angularfire2';

@Injectable()
export class AuthService {
  public isLoggedIn;

  public usersCollection;
  public userData = null;

firebaseAuth: AngularFireAuth;

  constructor (public http : Http,  private router: Router, private eventEmitter : Events, public af: AngularFire, public configVars : VariableService, private _AngularFire: AngularFire) {
    this.isLoggedIn = false;

    this.firebaseAuth = _AngularFire.auth;

    this.af.auth.subscribe(auth => {
      if(auth != null) {
        this.userData = auth;
        this.isLoggedIn = true;
        this.usersCollection = af.database.object("users/" + this.userData.uid);


        //dataToSet.timestamp = Math.floor((new Date()).getTime() / 1000);


        var today = new Date().toLocaleDateString('en-GB', {
            day : 'numeric',
            month : 'short',
            year : 'numeric'
        }).split(' ').join(' ');

        var dataToSet = {
          timestamp : Math.floor((new Date()).getTime() / 1000),
          displayName : this.userData.auth.providerData[0].displayName,
          email : this.userData.auth.providerData[0].email,
          photoURL : this.userData.auth.providerData[0].photoURL,
          providerId : this.userData.auth.providerData[0].providerId,
          registeredAt : " ",
          city : "Unknown location",
          birthDay: " ",
          birthMonth: " ",
          birthYear: " ",
          description : " ",
          cover1 : " ",
          cover2 : " ",
          cover3 : " ",
          birthDate : " "
        };


        af.database.object("users/" + this.userData.uid).take(1).subscribe((_data) => {
              if(!_data.registeredAt) {
                dataToSet.registeredAt = today;
                dataToSet.photoURL = this.userData.auth.providerData[0].photoURL || this.configVars.apiServerAdress+"/common/assets/images/default_user.png";
                dataToSet.displayName = this.userData.auth.providerData[0].displayName || "Unknown";
              }else{
                dataToSet.registeredAt = _data.registeredAt;
                dataToSet.photoURL = _data.photoURL;
                dataToSet.displayName = _data.displayName;
                dataToSet.email = _data.email;
                dataToSet.city = _data.city || "";
                dataToSet.birthDay = _data.birthDay || "";
                dataToSet.birthMonth = _data.birthMonth || "";
                dataToSet.birthYear = _data.birthYear || "";
                dataToSet.description = _data.description || "";
                dataToSet.cover1 = _data.cover1 || "";
                dataToSet.cover2 = _data.cover2 || "";
                dataToSet.cover3 = _data.cover3 || "";
                dataToSet.birthDate = _data.birthDate || "";
              }



              this.usersCollection.set(dataToSet).then((_data) => {
                  }).catch((_error) => {
                      console.log(_error)
                  })
            })

        //this.router.navigate(['/home/all']);
      }else{
        this.userData = null;
        this.isLoggedIn = false;
      }
    });
  }

  changePassword(password) {
  }
  login(username, password) {
    var self = this;
    this.af.auth.login({ email : username, password : password },
   { provider: AuthProviders.Password, method: AuthMethods.Password })
   .catch(function(err) {
     self.eventEmitter.loginErrorsF(err);
   })
  }

  loginWithFacebook () {
    this.af.auth.login({provider: AuthProviders.Facebook,
    method: AuthMethods.Popup,
    scope: ['email']})
  }

  loginWithGoogle () {
    this.af.auth.login({provider: AuthProviders.Google,
    method: AuthMethods.Popup,
    scope: ['email'] })
  }


  signup(username, password) {
    var self = this;
    this.af.auth.createUser({ email : username, password : password })
    .then (res => {
      res.auth.sendEmailVerification()
      .then(res => {
        console.log("email validation sent");
      })
    })
    .catch(function(err) {
      self.eventEmitter.loginErrorsF(err);
    })
  }

  checkLogin() {
   return this.af.auth
     .take(1)
     .map((authState: FirebaseAuthState) => !!authState)
     .do(authenticated => {
       if (!authenticated) this.router.navigate(['/login']);
     });
  }

  resetPassword(email) {
    console.log("reset email: ", email);
    firebase.auth().sendPasswordResetEmail(email)
    .then(res => {
      this.eventEmitter.loginErrorsF({message : 'Email about reseting the password was sent to you!'});
    })
    .catch(res => {
      this.eventEmitter.loginErrorsF({message : 'Please make sure that the email adress is valid!'});
    })
    ;
  }


  logout() {

    this.af.auth.logout()

  }
}

export const AUTH_SERVICE_PROVIDER = [
  AuthService
];
