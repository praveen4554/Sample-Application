import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../../services/CommonFunctions";

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/sunmooltoothers/toOthersDetails/SunmoolToOthersDetails.css'],
  templateUrl: './src/app/components/dashboard/pages/sunmooltoothers/toOthersDetails/SunmoolToOthersDetails.html',
})
export class SunmoolToOthersDetailsComponent {


  public offers = [];
  public editOpened = false;
  public item = {};
  public currentSunmool = {};

  public userInfo = {};

  public storyOnBlogAccept = "";
  public sunmoolStory = '';
  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {

  }

  openEdit(offer) {
    this.currentSunmool = offer;
    this.userInfo = offer.offerToDetails;
    this.item = offer.mainItemDetails;
    this.editOpened = true;

    this.storyOnBlogAccept = offer.blogAccept
    this.sunmoolStory = offer.story;
  }
  storyOnBlog(val) {
    this.storyOnBlogAccept = val;

    return false;
  }


  postSunmoolOffer() {
    var offer = {
      offerFrom : this.auth.userData.uid,
      offerTo : this.currentSunmool['offerTo'],
      item : this.currentSunmool['item'],
      story : this.sunmoolStory,
      blogAccept : this.storyOnBlogAccept,
      timestamp : Math.floor((new Date()).getTime() / 1000)
    }

    this.af.database.object(`/sunmool/${this.currentSunmool['$key']}`).set(offer).then(res => {
      this.af.database.list('/notifications/'+offer.offerTo)
      .push({from : this.auth.userData.uid, type : "sunmoolOfferUpdate", item : offer.item, timestamp : offer.timestamp}).then(res => {

        this.sunmoolStory = "";
        this.storyOnBlogAccept = '';
        this.editOpened = false;


      })
    });

  }



  ngOnInit() {


  this.route.params.subscribe(params => {



    //get current selected user items
    this.af.database.list('/sunmool', {
       query: {
         orderByChild: 'item',
         equalTo: params['itemId']
       }
     })

     .map(items => {
       var toShow = [];
     for (let item of items) {

       this.af.database.object(`/items/${item.item}`).take(1).subscribe(mainItem => {
         item.mainItemDetails = mainItem;
       });

       this.af.database.object(`/users/${item.offerTo}`).take(1).subscribe(user => {
         item.offerToDetails = user;
       });

       this.af.database.object(`/users/${this.auth.userData.uid}`).take(1).subscribe(user => {
         item.offerFromDetails = user;
       });

       this.af.database.object(`/likes/${item.item}`).subscribe(likes => {
         item.likes = likes;
       });


       var queryList = this.af.database.list('/comments/'+item.item).take(1).subscribe(res => {
         item.comments = res;
       });

       if(item.offerFrom == this.auth.userData.uid)
        toShow.push(item);

     }

     return toShow;
   })
     .subscribe(myItems => {
      this.offers = myItems;
     });





  })

}

}
