import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../services/CommonFunctions";


import {FileUploader} from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/editProfile/EditProfile.css'],
  templateUrl: './src/app/components/dashboard/pages/editProfile/EditProfile.html',
})
export class EditProfileComponent {

  public userInfo = {};
  public monthDay = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','29','29','30', '31'];
  public months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public years = [];

  public uploader1:FileUploader;
  public uploader2:FileUploader;
  public uploader3:FileUploader;
  public uploaderProfile:FileUploader;

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {
    this.af.database.object('/users/'+this.auth.userData.uid).take(1).subscribe(userInfo => {
                this.userInfo = userInfo;
     });

     var startYear = 1916;
     for(var i=1; i<=100; i++) {
       this.years.push(startYear);
       startYear++;
     }


     this.uploader1 = new FileUploader({url: configVars.apiServerAdress+"/api", autoUpload : true});
     this.uploader2 = new FileUploader({url: configVars.apiServerAdress+"/api", autoUpload : true});
     this.uploader3 = new FileUploader({url: configVars.apiServerAdress+"/api", autoUpload : true});
     this.uploaderProfile = new FileUploader({url: configVars.apiServerAdress+"/api", autoUpload : true});


     this.uploader1.onCompleteItem = (item, response, status, header) => {
       if (status === 200) {
         this.userInfo['cover1'] = JSON.parse(response).filename;
       }
     }
     this.uploader2.onCompleteItem = (item, response, status, header) => {
       if (status === 200) {
         this.userInfo['cover2'] = JSON.parse(response).filename;
       }
     }
     this.uploader3.onCompleteItem = (item, response, status, header) => {
       if (status === 200) {
         this.userInfo['cover3'] = JSON.parse(response).filename;
       }
     }
     this.uploaderProfile.onCompleteItem = (item, response, status, header) => {
       if (status === 200) {
         this.userInfo['photoURL'] = this.configVars.apiServerAdress+"/uploads/"+ JSON.parse(response).filename;
       }
     }
  }


  saveInfo() {
    if(this.userInfo['password']) {
        if(this.userInfo['password'] == this.userInfo['confirmPassword']) {
          this.auth.changePassword(this.userInfo['password']);
        }else{
          alert("The two password fields must be the same.")
          return;
        }
    }

    delete this.userInfo['$key'];
    delete this.userInfo['$exists'];
    delete this.userInfo['password'];
    delete this.userInfo['confirmPassword'];
    this.af.database.object('/users/'+this.auth.userData.uid).set(this.userInfo);
    alert("Your details are saved!");
  }

  changeBirthday(data) {
    this.userInfo['birthDay'] = data;
    return false;
  }
  changeBirthmonth(data) {
    this.userInfo['birthMonth'] = data;
    return false;
  }
  changeBirthyear(data) {
    this.userInfo['birthYear'] = data;
    return false;
  }

}
