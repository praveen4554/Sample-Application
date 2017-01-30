import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import {AuthService} from "../../../../services/Auth/AuthService";
import { VariableService } from '../../../../services/variables';
import {CommonFunctions} from "../../../../services/CommonFunctions";

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/personalization/Personalization.css'],
  templateUrl: './src/app/components/dashboard/pages/personalization/Personalization.html',
})
export class PersonalizationComponent {

  public itemSize = "";
  public shoeSize = "";
  constructor(public router:Router, public af: AngularFire, public auth: AuthService, public configVars : VariableService, public common : CommonFunctions) {
    this.af.database.object("personalData/"+this.auth.userData.uid).take(1).subscribe(data => {
      this.itemSize = data.myItemSize;
      this.shoeSize = data.myShoeSize;
     });
  }

  changeSize (size) {
    this.itemSize = size;
  }

  changeShoeSize(size) {
    this.shoeSize = size;
  }

  savePreferences () {
    var item = {
      myItemSize : this.itemSize,
      myShoeSize : this.shoeSize
    }

    this.af.database.object("personalData/"+this.auth.userData.uid).update(item).then((_data) => {
          alert("Yor information has been saved!")
        })
  }

}
