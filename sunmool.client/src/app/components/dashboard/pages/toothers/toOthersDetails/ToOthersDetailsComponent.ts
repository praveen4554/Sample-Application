import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../../services/CommonFunctions";


@Component({
  selector: 'offertme-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/toothers/ToOthersDetails/ToOthersDetails.css'],
  templateUrl: './src/app/components/dashboard/pages/toothers/ToOthersDetails/ToOthersDetails.html',
})
export class ToOthersDetailsComponent {

  public offers = [];
  public editOpened = false;
  public currentOffer = {};


  public carouselItems = [];
  public userInfo = {};

  public itemsSelected = {};
  public myItemsSelected = {};
  public currentLoggedItems = [];
  public itemsSelectedNum = 0;

  public mySelectedArr = [];
  public mySelectedArrRaw = [];
  public myItemsSelectedNum = 0;
  public itemPickNum = 0;
  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {

  }

  openEditModal() {
    this.editOpened = true;
  }


  selectItems (itemId) {
    if(this.itemsSelected[itemId]) {
      this.itemsSelected[itemId] = false;
      this.itemsSelectedNum--;
    }else{
      this.itemsSelected[itemId] = true;
      this.itemsSelectedNum++;
    }
    var count = 0;


  }

acceptCounterOffer () {
  this.af.database.object('/offers/'+this.currentOffer['$key']).update({status : "counterOfferAccepted"}).then(res => {

      this.af.database.list('/notifications/'+this.currentOffer['offerTo'])
      .push({from : this.auth.userData.uid, type : "counterOfferAccepted", item : this.currentOffer['mainItem'], timestamp : this.currentOffer['timestamp'], numOffers : this.currentOffer['itemsToOffer']['length']})
  })
}

  changeItemPickNum(num){
    this.itemPickNum = num+1;
    return false;
  }


  offerItem() {
    var itemsToGet = [];
    var itemsToOffer = [];
    for(var i in this.itemsSelected) {
      if(this.itemsSelected[i]) {
        itemsToGet.push(i);
      }
    }
    for(var j in this.myItemsSelected) {
      if(this.myItemsSelected[j].val) {
        itemsToOffer.push(j);
      }
    }

    var offer = {
      offerFrom : this.auth.userData.uid,
      offerTo: this.currentOffer['offerTo'],
      mainItem : this.currentOffer['mainItem'],
      itemsToGet : itemsToGet,
      itemsToOffer : itemsToOffer,
      itemsToPick : this.itemPickNum,
      timestamp : Math.floor((new Date()).getTime() / 1000)
    };

      this.af.database.object('/offers/'+this.currentOffer['$key']).set(offer).then(res => {

        this.af.database.list('/notifications/'+offer.offerTo)
        .push({from : this.auth.userData.uid, type : "updateOffer", item : offer.mainItem, timestamp : offer.timestamp, numOffers : offer.itemsToOffer.length})

      });

    this.currentOffer = {};
    this.carouselItems = [];
    this.userInfo = {};

    this.itemsSelected = {};
    this.myItemsSelected = {};
    this.currentLoggedItems = [];
    this.itemsSelectedNum = 0;

    this.mySelectedArr = [];
    this.mySelectedArrRaw = [];
    this.myItemsSelectedNum = 0;
    this.itemPickNum = 0;


    this.editOpened = false;
  }

  mySelectItems (itemId, picture) {
    if(!this.myItemsSelected[itemId]) {
        this.myItemsSelected[itemId] = {};
    }

    this.mySelectedArr = [];
    this.mySelectedArrRaw = [];
    if(this.myItemsSelected[itemId].val) {
      this.myItemsSelected[itemId].val = false;
      this.myItemsSelected[itemId].picture = picture;
      this.myItemsSelectedNum--;
    }else{

      this.myItemsSelected[itemId].val = true;
      this.myItemsSelected[itemId].picture = picture;
      this.myItemsSelectedNum++;
    }

    for(var i in this.myItemsSelected) {
      if(this.myItemsSelected[i].val == true) {
        this.mySelectedArrRaw.push(this.myItemsSelected[i].picture)
      }
    }
    this.mySelectedArr = this.common.makeGroupOfItems(this.mySelectedArrRaw, 7);
    this.itemPickNum = 0;
  }

  setCurrentOffer(offer) {
    this.currentOffer = offer;
    this.userInfo = offer.offerToDetails;

    //get current selected user items
    this.af.database.list('/items', {
       query: {
         orderByChild: 'uid',
         equalTo: offer.offerTo
       }
     })

     .map(items => {
     for (let item of items) {
       this.af.database.object(`/likes/${item.$key}`).subscribe(likes => {
         item.likes = likes;
       });

     }

     return items;
   })
     .subscribe(myItems => {
                this.carouselItems = this.common.makeGroupOfItems(myItems, 4);
     });



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

      }

      return items;
    })
      .subscribe(myItems => {
                 this.currentLoggedItems = this.common.makeGroupOfItems(myItems, 4);

      });

      for(var i in this.currentOffer['itemsToGet']) {
        this.itemsSelected[this.currentOffer['itemsToGet'][i]] = true;
      }

      for(var j in this.currentOffer['itemsToOfferDetails']) {
        this.mySelectItems(this.currentOffer['itemsToOfferDetails'][j].$key, this.currentOffer['itemsToOfferDetails'][j].photos[0])
      }

  }
  ngOnInit() {


  this.route.params.subscribe(params => {



    //get current selected user items
    this.af.database.list('/offers', {
       query: {
         orderByChild: 'mainItem',
         equalTo: params['itemId']
       }
     })

     .map(items => {
       var toShow = [];
     for (let item of items) {

       this.af.database.object(`/items/${item.mainItem}`).take(1).subscribe(mainItem => {
         item.mainItemDetails = mainItem;
       });

       this.af.database.object(`/users/${item.offerTo}`).take(1).subscribe(user => {
         item.offerToDetails = user;
       });

       this.af.database.object(`/users/${this.auth.userData.uid}`).take(1).subscribe(user => {
         item.offerFromDetails = user;
       });

       this.af.database.object(`/likes/${item.mainItem}`).subscribe(likes => {
         item.likes = likes;
       });


       var queryList = this.af.database.list('/comments/'+item.mainItem).take(1).subscribe(res => {
         item.comments = res;
       });

       if(item.offerFrom == this.auth.userData.uid)
        toShow.push(item);

     }

     return toShow;
   })
     .subscribe(myItems => {
      this.offers = myItems;
      var countToOffer = 0;
      var counterToGet = 0;

      var offersPhotos = [];
      var getPhotos = [];
      this.offers.map(offers => {
        for(let item of offers.itemsToOffer)
        {
          this.af.database.object('/items/'+item).take(1).subscribe(res => {
            if(!offers.itemsToOfferDetails)
              offers.itemsToOfferDetails = [];

              countToOffer++;
              if(res.photos) {
                offersPhotos.push(res);
              }
              if(countToOffer == offers.itemsToOffer.length) {
                countToOffer = 0;
                offers.offerPhotos = this.common.makeGroupOfItems(offersPhotos, 2);
                offersPhotos = [];
              }

              offers.itemsToOfferDetails.push(res)
          });


        }

        for(let item of offers.itemsToGet)
        {
          this.af.database.object('/items/'+item).take(1).subscribe(res => {
            if(!offers.itemsToGetDetails)
              offers.itemsToGetDetails = [];


              counterToGet++;
              if(res.photos) {
                getPhotos.push(res);
              }
              if(counterToGet == offers.itemsToGet.length) {
                counterToGet = 0;
                offers.getPhotos = this.common.makeGroupOfItems(getPhotos, 2);
                getPhotos = [];
              }


              offers.itemsToGetDetails.push(res)
          });


        }

        return offers;

      })

     });





  })

}

}
