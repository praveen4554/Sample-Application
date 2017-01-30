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
  styleUrls: ['./src/app/components/dashboard/pages/sunmooltome/toMeDetails/SunmoolToMeDetails.css'],
  templateUrl: './src/app/components/dashboard/pages/sunmooltome/toMeDetails/SunmoolToMeDetails.html',
})
export class SunmoolToMeDetailsComponent {


  public offers = [];
  
  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {

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

       this.af.database.object(`/users/${item.offerFrom}`).take(1).subscribe(user => {
         item.offerFromDetails = user;
       });

       this.af.database.object(`/likes/${item.item}`).subscribe(likes => {
         item.likes = likes;
       });


       var queryList = this.af.database.list('/comments/'+item.item).take(1).subscribe(res => {
         item.comments = res;
       });

        toShow.push(item);

     }

     return toShow;
   })
     .subscribe(myItems => {
      this.offers = myItems;
      this.offers = this.offers.reverse();
     });





  })

}

}
