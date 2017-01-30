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
  styleUrls: ['./src/app/components/dashboard/pages/tome/ToMeDetails/ToMeDetails.css'],
  templateUrl: './src/app/components/dashboard/pages/tome/ToMeDetails/ToMeDetails.html',
})
export class ToMeDetailsComponent {


  public offers = [];
  public itemDetailsVisible = false;
  public currentItemDetails = {photos : ""};
  public currentSelectedPhotoDetail ="";

  public selectedItems = {};

  public editOpened = false;

  public activeOffer;

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {

  }

  counterOffer() {
    this.editOpened = true;
  }

  public currentOffer = {};
  public userInfo = {};
  public carouselItems = [];
  public itemsSelected = {};
  public myItemsSelected = {};
  public currentLoggedItems = [];
  public itemsSelectedNum = 0;

  public mySelectedArr = [];
  public mySelectedArrRaw = [];
  public myItemsSelectedNum = 0;
  public itemPickNum = 0;


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
      offerFrom : this.currentOffer['offerFrom'],
      offerTo: this.currentOffer['offerTo'],
      mainItem : this.currentOffer['mainItem'],
      itemsToGet : itemsToGet,
      itemsToOffer : itemsToOffer,
      itemsToPick : this.itemPickNum,
      timestamp : Math.floor((new Date()).getTime() / 1000),
      status : "counterOffer",
      oldOffer : {
        offerFrom : this.currentOffer['offerFrom'],
        offerTo: this.currentOffer['offerTo'],
        mainItem : this.currentOffer['mainItem'],
        itemsToGet : this.currentOffer['itemsToGet'],
        itemsToOffer : this.currentOffer['itemsToOffer'],
        itemsToPick : this.currentOffer['itemsToPick'],
        timestamp : this.currentOffer['timestamp']
      }
    };


      this.af.database.object('/offers/'+this.currentOffer['$key']).set(offer).then(res => {

        this.af.database.list('/notifications/'+offer.offerFrom)
        .push({from : this.auth.userData.uid, type : "counterOffer", item : offer.mainItem, timestamp : offer.timestamp, numOffers : offer.itemsToOffer.length})

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

  changeItemPickNum(num){
    this.itemPickNum = num+1;
    return false;
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
             this.carouselItems = [];

               for(let itm of myItems) {
                 if(!itm.sunmool) {
                   if(itm.status != "inProcess")
                    this.carouselItems.push(itm);
                 }
               }
                this.carouselItems = this.common.makeGroupOfItems(this.carouselItems, 4);
     });



     this.af.database.list('/items', {
        query: {
          orderByChild: 'uid',
          equalTo: offer.offerFrom
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

        this.currentLoggedItems = [];

          for(let itm of myItems) {
            if(!itm.sunmool) {
              if(itm.status != "inProcess")
               this.currentLoggedItems.push(itm);
            }
          }

                 this.currentLoggedItems = this.common.makeGroupOfItems(this.currentLoggedItems, 4);

      });

      for(var i in this.currentOffer['itemsToGet']) {
        this.itemsSelected[this.currentOffer['itemsToGet'][i]] = true;
      }

      for(var j in this.currentOffer['itemsToOfferDetails']) {
        this.mySelectItems(this.currentOffer['itemsToOfferDetails'][j].$key, this.currentOffer['itemsToOfferDetails'][j].photos[0])
      }

  }

  public toggleItemDetailsVisible () {
    if(this.itemDetailsVisible) {
      this.itemDetailsVisible = false;
      this.currentSelectedPhotoDetail = "";
    }else{
      this.itemDetailsVisible = true;
    }

  }

  public setItemDetails(currentItemDetails, activeOffer, itemIndex) {
    this.activeOffer = activeOffer;
    this.currentItemDetails[activeOffer] = {item : currentItemDetails, itemIndex : itemIndex};

    if(this.currentItemDetails[activeOffer].item.photos)
      this.currentSelectedPhotoDetail = currentItemDetails.photos[0];
    else
      this.currentSelectedPhotoDetail = "";


      return false;
  }

  isItemSelecte(itemId) {
    if(!this.offers[this.activeOffer].selectedCount) {
      this.offers[this.activeOffer].selectedCount = 0;
    }
    if(this.selectedItems[itemId] == true) {

      return true;

    }else{
      return false;
    }


  }

  selectItem(item, bool) {


    this.selectedItems[item.item.$key] = bool;
    if(!this.offers[this.activeOffer].acceptedItems)
      this.offers[this.activeOffer].acceptedItems = {};

      this.offers[this.activeOffer].acceptedItems[item.item.$key] = bool;


    if(bool) {
      this.offers[this.activeOffer].selectedCount++;
    }else{
      this.offers[this.activeOffer].selectedCount--;
    }

  }

  displaySelectedOverlay() {

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

       this.af.database.object(`/items/${item.mainItem}`).subscribe(mainItem => {
         item.mainItemDetails = mainItem;
       });

       this.af.database.object(`/users/${item.offerTo}`).subscribe(user => {
         item.offerToDetails = user;
       });

       this.af.database.object(`/users/${item.offerFrom}`).subscribe(user => {
         item.offerFromDetails = user;
       });

       this.af.database.object(`/likes/${item.mainItem}`).subscribe(likes => {
         item.likes = likes;
       });


       var queryList = this.af.database.list('/comments/'+item.mainItem).subscribe(res => {
         item.comments = res;
       });

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
          this.af.database.object('/items/'+item).subscribe(res => {

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
          this.af.database.object('/items/'+item).subscribe(res => {
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

      this.offers = this.offers.reverse();
     });





  })

}

}
