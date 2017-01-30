import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../services/CommonFunctions";


@Component({
  selector: 'oofertother-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/toothers/OfferToOthers.css'],
  templateUrl: './src/app/components/dashboard/pages/toothers/OfferToOthers.html',
})
export class OfferToOthersComponent {


public items = [];
public itemsRaw = [];

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {


    //get current selected user items
    this.af.database.list('/offers', {
       query: {
         orderByChild: 'offerFrom',
         equalTo: this.auth.userData.uid
       }
     }).take(1)

     .map(items => {
     for (let item of items) {
       this.af.database.object(`/items/${item.mainItem}`).take(1).subscribe(mainItem => {
         item.mainItemDetails = mainItem;
       });

       this.af.database.object(`/likes/${item.mainItem}`).subscribe(likes => {
         item.likes = likes;
       });


       var queryList = this.af.database.list('/comments/'+item.mainItem).take(1).subscribe(res => {
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
                  if(!auxObj[this.itemsRaw[i].mainItem])
                    auxObj[this.itemsRaw[i].mainItem] = [];

                  auxObj[this.itemsRaw[i].mainItem].push(this.itemsRaw[i]);
                }

                for(var i in auxObj) {
                  this.items.push(auxObj[i])
                }

     });


  }

}
