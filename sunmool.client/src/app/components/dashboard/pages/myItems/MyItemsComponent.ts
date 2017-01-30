import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../services/CommonFunctions";

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/myItems/MyItems.css'],
  templateUrl: './src/app/components/dashboard/pages/myItems/MyItems.html',
})
export class MyItemsComponent {


  public items = [];

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {


     this.af.database.list('/items', {
        query: {
          orderByChild: 'uid',
          equalTo: this.auth.userData.uid
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

        this.af.database.list('/comments/'+item.$key).take(1).subscribe(res => {
          item.comments = res;
        });

        this.af.database.list('/offers/', {
           query: {
             orderByChild: 'mainItem',
             equalTo: item.$key
           }
         }).take(1).subscribe(offers => {
          item.offersNum = offers.length;
        });

      }

      return items;
    })
      .subscribe(myItems => {
         this.items = myItems;
      });



  }

}
