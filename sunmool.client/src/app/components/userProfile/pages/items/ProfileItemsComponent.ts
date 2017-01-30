import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../services/CommonFunctions";

@Component({
  selector: 'itmc-cmpnt',
  styleUrls: ['./src/app/components/userProfile/pages/items/ProfileItems.css'],
  templateUrl: './src/app/components/userProfile/pages/items/ProfileItems.html',
})
export class ProfileItemsComponent {

  public userId = "";
  public items = [];

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {}


  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.route.parent
      .params.subscribe(params => {
        if (params['usrId'] && this.auth.userData != null) {
          this.userId = params["usrId"];


            //get my items

            this.af.database.list('/items', {
               query: {
                 orderByChild: 'uid',
                 equalTo: this.userId
               }
             })

             .map(items => {
             for (let item of items) {
               this.af.database.object(`/likes/${item.$key}`).subscribe(likes => {
                 item.likes = likes;
               });

               this.af.database.object(`/users/${item.uid}`).subscribe(user => {
                 item.user = user;
               });

             }

             return items;
           })
             .subscribe(myItems => {
                this.items = myItems;
             });

            //end get my items

        }
      });
  }


}
