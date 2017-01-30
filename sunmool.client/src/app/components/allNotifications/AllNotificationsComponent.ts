import { Component } from '@angular/core';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../services/variables';
import { Router, ActivatedRoute} from '@angular/router';
import {AuthService} from "../../services/Auth/AuthService";
import {CommonFunctions} from "../../services/CommonFunctions";
import {Observable} from 'rxjs/Rx';

import { Events } from '../../services/Auth/Events';
@Component({
  selector: 'allNotifications-cmpnt',
  styleUrls: ['./src/app/components/allNotifications/AllNotifications.css'],
  templateUrl: './src/app/components/allNotifications/AllNotifications.html',
})
export class AllNotificationsComponent {

  public notifications = [];

  public unreadNotifications = 0;

  constructor(public af : AngularFire, public configVars : VariableService, public router : Router, public auth : AuthService, public route: ActivatedRoute, private events : Events, public common : CommonFunctions) {

    var notifications = this.af.database.list('/notifications/'+this.auth.userData.uid, {
      query: {
        limitToLast : 200,
        orderByKey: true
      }
    }).map(items => {
      this.unreadNotifications = 0;
    for (let item of items) {
      // Find each corresponding associated object and store it as a FibreaseObjectObservable
      this.af.database.object(`/users/${item.from}`).subscribe(user => {
        item.user = user;
      });
      this.af.database.object(`/items/${item.item}`).subscribe(itemDetails => {
        item.itemDetails = itemDetails;
        if(item && !item.read && item.itemDetails.$exists()) {
          this.unreadNotifications++;
        }
      });
    }

    return items;
  });



  notifications.subscribe(res => {
    this.notifications = res.reverse();
  });


  }

}
