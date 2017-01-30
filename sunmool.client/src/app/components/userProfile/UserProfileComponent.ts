import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../services/Auth/AuthService";
import {CommonFunctions} from "../../services/CommonFunctions";


@Component({
  selector: 'proff-cmpnt',
  styleUrls: ['./src/app/components/userProfile/UserProfile.css'],
  templateUrl: './src/app/components/userProfile/UserProfile.html',
})
export class UserProfileComponent {

  public userId = "";
  public userInfo = {};

  public favoritesCount = 0;
  public myItemsCount = 0;

  public followingCount = 0;
  public myFollowersCount = 0;

  public myBrandsCount = 0;

  public isFollowed = false;

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {}





  ngOnInit() {
    this.route.params.subscribe(params => {
        if (params['usrId'] && this.auth.userData != null) {
          this.userId = params['usrId'];

          this.af.database.object('/users/'+this.userId).take(1).subscribe(userInfo => {
                      this.userInfo = userInfo;
           });


           //get items count
           this.af.database.list('/items/', {
               query: {
                 orderByChild: 'uid',
                 equalTo: this.userId
               }
            }).subscribe(myItems => {
                this.myItemsCount = myItems.length;
            });


            //get favorites count
            this.af.database.list('/favorites/'+this.userId).take(1).subscribe(favorites => {
              this.favoritesCount = 0;
                for(var i = 0; i< favorites.length; i++) {
                  if(favorites[i].favorite)
                  this.favoritesCount +=1;
                }
             });

             //following count
             this.af.database.list('/following/'+this.userId).subscribe(following => {
                this.followingCount = 0;
                   for(var i = 0; i< following.length; i++) {
                     if(following[i].following) {
                       this.followingCount +=1;
                     }

                   }
              });




              this.af.database.list('followingBrand/'+this.auth.userData.uid, {
                query: {
                  orderByChild: 'following',
                  equalTo: true
                }
              }).subscribe(res => {
                this.myBrandsCount = res.length;
              })

              //followers count
              this.af.database.list('/followers/'+this.userId).subscribe(followers => {
                  this.myFollowersCount = 0;
                    for(var i = 0; i< followers.length; i++) {
                      if(followers[i].following)
                      this.myFollowersCount +=1;
                    }
               });


             //get following?
             this.af.database.object('/following/'+this.auth.userData.uid+"/"+this.userId).subscribe(following => {
                   this.isFollowed = following.following;
              });

        }
      });
  }


}
