import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import {AuthService} from "../../../../services/Auth/AuthService";
import { VariableService } from '../../../../services/variables';
import {CommonFunctions} from "../../../../services/CommonFunctions";

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/notification/Notification.css'],
  templateUrl: './src/app/components/dashboard/pages/notification/Notification.html',
})
export class NotificationComponent {

  public saveData = {};

  constructor(public router:Router, public af: AngularFire, public auth: AuthService, public configVars : VariableService, public common : CommonFunctions) {
    this.af.database.object("emailNotificationSettings/"+this.auth.userData.uid).take(1).subscribe(data => {
      this.saveData = data;
     });
  }

  saveOptions() {

    delete this.saveData['$exists'];
    delete this.saveData['$key'];
    delete this.saveData['$value'];

    this.af.database.object("emailNotificationSettings/"+this.auth.userData.uid).update(this.saveData).then((_data) => {
          alert("Yor information has been saved!")
        })
  }

}
