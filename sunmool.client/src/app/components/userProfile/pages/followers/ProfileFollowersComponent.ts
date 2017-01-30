import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../services/CommonFunctions";

@Component({
  selector: 'home-cmpnt',
  styleUrls: ['./src/app/components/userProfile/pages/followers/ProfileFollowers.css'],
  templateUrl: './src/app/components/userProfile/pages/followers/ProfileFollowers.html',
})
export class ProfileFollowersComponent {

  public userId = "";
  public followers = [];
  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions)  {}


  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.route.parent
      .params.subscribe(params => {
        if (params['usrId'] && this.auth.userData != null) {
          this.userId = params["usrId"];



          //following count
          this.af.database.list('/followers/'+this.userId)

          .map(items => {
          for (let item of items) {
            this.af.database.object(`/users/${item.$key}`).subscribe(user => {
              item.user = user;

              this.af.database.object('/following/'+this.auth.userData.uid+"/"+user.$key).subscribe(isFollowing => {

                item.user.isFollowing = isFollowing.following;
              });

            });

          }

          return items;
        })

          .subscribe(following => {
                this.followers = [];
                for(let follower of following) {
                  if(follower.following)
                  this.followers.push(follower);
                }
           });



        }
      });
  }

}
