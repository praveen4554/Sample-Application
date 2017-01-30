import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../services/CommonFunctions";

@Component({
  selector: 'proffav-cmpnt',
  styleUrls: ['./src/app/components/userProfile/pages/favorites/ProfileFavorites.css'],
  templateUrl: './src/app/components/userProfile/pages/favorites/ProfileFavorites.html',
})
export class ProfileFavoritesComponent {

  public userId = "";
  public items = [];

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {}


  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.route.parent
      .params.subscribe(params => {
        if (params['usrId'] && this.auth.userData != null) {
          this.userId = params["usrId"];
          //get favorite items

          this.af.database.list('/favorites/'+this.userId).take(1)

           .map(favorites => {
           for (let favorite of favorites) {


             this.af.database.object(`/items/${favorite.$key}`)
             .map(item => {

                if(favorite.favorite) {
                  this.af.database.object(`/likes/${item.$key}`).subscribe(likes => {
                    item.likes = likes;
                  });

                  this.af.database.object(`/users/${item.uid}`).subscribe(user => {
                    item.user = user;
                  });
                }
               return item;
             })
             .subscribe(item => {
               if(favorite.favorite)
               {
                 this.items.push(item);
               }

               favorite.item = item;
             });

           }

           return favorites;
         })


           .subscribe(myItems => {

           });

          //end get favorite items


        }
      });
  }

}
