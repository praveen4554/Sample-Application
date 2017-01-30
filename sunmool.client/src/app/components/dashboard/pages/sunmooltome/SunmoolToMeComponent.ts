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
  styleUrls: ['./src/app/components/dashboard/pages/sunmooltome/SunmoolToMe.css'],
  templateUrl: './src/app/components/dashboard/pages/sunmooltome/SunmoolToMe.html',
})
export class SunmoolToMeComponent {

  public items = [];
  public itemsRaw = [];

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {


    //get current selected user items
    this.af.database.list('/sunmool', {
       query: {
         orderByChild: 'offerTo',
         equalTo: this.auth.userData.uid
       }
     }).take(1)

     .map(items => {
     for (let item of items) {
       this.af.database.object(`/items/${item.item}`).take(1).subscribe(mainItem => {
         item.mainItemDetails = mainItem;
       });

       this.af.database.object(`/likes/${item.item}`).subscribe(likes => {
         item.likes = likes;
       });


       var queryList = this.af.database.list('/comments/'+item.item).take(1).subscribe(res => {
       item.comments = res;
     });



     }

     return items;
   })
     .subscribe(myItems => {
                this.itemsRaw = myItems;
                this.items = myItems;
                this.items = [];
                var  auxObj= {};
                for(var i in this.itemsRaw) {
                  if(this.itemsRaw[i].status != "declined") {
                    if(!auxObj[this.itemsRaw[i].mainItem])
                      auxObj[this.itemsRaw[i].mainItem] = [];

                    auxObj[this.itemsRaw[i].mainItem].push(this.itemsRaw[i]);
                  }

                }

                for(var i in auxObj) {
                  this.items.push(auxObj[i])
                }
     });




  }

}
