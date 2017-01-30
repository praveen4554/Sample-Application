import { Injectable, EventEmitter }             from '@angular/core';
import {AuthService} from "./Auth/AuthService";
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { Router} from '@angular/router';

@Injectable()
export class CommonFunctions {

  public subcategories = {
    dresses : [
      "Daytime",
      "Cocktail",
      "Gown",
      "Party",
      "Work"
    ],
    tops : [
      "Blouses",
      "Knits & Tees",
      "Fancy"
    ],
    skirts : [
      "Maxi",
      "Mid length",
      "Mini",
      "Pencil"
    ],
    jackets : [
      "Leather & faux leather",
      "Jackets",
      "Blazers",
      "Vests"
    ],
    pants : [
      "Long",
      "Shorts",
      "Leggings",
      "Leather & faux leather"
    ],
    activewear : [
      "Swimwear",
      "Workout",
      "Jackets & hoodies",
      "Sports bras"
    ],
    costume : [
      "Men",
      "Women",
      "Children",
      "Accessories"
    ],
    accessories : [
      "Jewelry",
      "Watches",
      "Belts",
      "Hand bag",
      "Sunglasses",
      "Hats",
      "Scarves",
      "Miscellaneous"
    ],
    shoes : [
      "Boots & booties",
      "Flats",
      "Pumps",
      "Platforms",
      "Sandals",
      "Wedges",
      "Sneakers"
    ],
    men : [
      "Shirts",
      "Suits",
      "Pants",
      "Bags",
      "Shoes",
      "Jackets",
      "Sports"
    ],
    kids : [
        "Tops",
        "Pants",
        "Skirts",
        "Sports",
        "Jackets",
        "Bags",
        "Shoes"
      ]

  }

  public categoriesSizes = {
    dresses : [
      {num : "0", val : "XXS"},
      {num : "2", val : "XS"},
      {num : "4", val : "S"},
      {num : "6", val : "S"},
      {num : "8", val : "M"},
      {num : "10", val : "M"},
      {num : "12", val : "L"},
      {num : "14", val : "L"},
      {num : "16", val : "XL"},
      {num : "18", val : "1X"},
      {num : "20", val : "2X"},
      {num : "22", val : "3X"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    tops : [
      {num : "0", val : "XXS"},
      {num : "2", val : "XS"},
      {num : "4", val : "S"},
      {num : "6", val : "S"},
      {num : "8", val : "M"},
      {num : "10", val : "M"},
      {num : "12", val : "L"},
      {num : "14", val : "L"},
      {num : "16", val : "XL"},
      {num : "18", val : "1X"},
      {num : "20", val : "2X"},
      {num : "22", val : "3X"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    skirts : [
      {num : "0", val : "XXS"},
      {num : "2", val : "XS"},
      {num : "4", val : "S"},
      {num : "6", val : "S"},
      {num : "8", val : "M"},
      {num : "10", val : "M"},
      {num : "12", val : "L"},
      {num : "14", val : "L"},
      {num : "16", val : "XL"},
      {num : "18", val : "1X"},
      {num : "20", val : "2X"},
      {num : "22", val : "3X"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    jackets : [
      {num : "0", val : "XXS"},
      {num : "2", val : "XS"},
      {num : "4", val : "S"},
      {num : "6", val : "S"},
      {num : "8", val : "M"},
      {num : "10", val : "M"},
      {num : "12", val : "L"},
      {num : "14", val : "L"},
      {num : "16", val : "XL"},
      {num : "18", val : "1X"},
      {num : "20", val : "2X"},
      {num : "22", val : "3X"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    pants : [
      {num : "0", val : "XXS"},
      {num : "2", val : "XS"},
      {num : "4", val : "S"},
      {num : "6", val : "S"},
      {num : "8", val : "M"},
      {num : "10", val : "M"},
      {num : "12", val : "L"},
      {num : "14", val : "L"},
      {num : "16", val : "XL"},
      {num : "18", val : "1X"},
      {num : "20", val : "2X"},
      {num : "22", val : "3X"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    activewear : [
      {num : "0", val : "XXS"},
      {num : "2", val : "XS"},
      {num : "4", val : "S"},
      {num : "6", val : "S"},
      {num : "8", val : "M"},
      {num : "10", val : "M"},
      {num : "12", val : "L"},
      {num : "14", val : "L"},
      {num : "16", val : "XL"},
      {num : "18", val : "1X"},
      {num : "20", val : "2X"},
      {num : "22", val : "3X"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    costume : [
      {num : "0", val : "XXS"},
      {num : "2", val : "XS"},
      {num : "4", val : "S"},
      {num : "6", val : "S"},
      {num : "8", val : "M"},
      {num : "10", val : "M"},
      {num : "12", val : "L"},
      {num : "14", val : "L"},
      {num : "16", val : "XL"},
      {num : "18", val : "1X"},
      {num : "20", val : "2X"},
      {num : "22", val : "3X"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    accessories : [
      {num : "0", val : "XXS"},
      {num : "2", val : "XS"},
      {num : "4", val : "S"},
      {num : "6", val : "S"},
      {num : "8", val : "M"},
      {num : "10", val : "M"},
      {num : "12", val : "L"},
      {num : "14", val : "L"},
      {num : "16", val : "XL"},
      {num : "18", val : "1X"},
      {num : "20", val : "2X"},
      {num : "22", val : "3X"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    shoes : [
      {num : "4", val : "35"},
      {num : "4.5", val : "35"},
      {num : "5", val : "35-36"},
      {num : "5.5", val : "36"},
      {num : "6", val : "36-37"},
      {num : "6.5", val : "37"},
      {num : "7", val : "37-38"},
      {num : "7.5", val : "38"},
      {num : "8", val : "38-39"},
      {num : "9", val : "39-40"},
      {num : "9.5", val : "40"},
      {num : "10", val : "40-41"},
      {num : "10.5", val : "41"},
      {num : "11", val : "41-42"},
      {num : "11.5", val : "42"},
      {num : "12", val : "42-43"}
    ],
    men : [
      {num : "28", val : "XS"},
      {num : "30", val : "S"},
      {num : "32", val : "M"},
      {num : "34", val : "L"},
      {num : "36", val : "XL"},
      {num : "38", val : "XXL"},
      {num : "40", val : "XXXL"},
      {num : "", val : "One size"},
      {num : "", val : "Others"}
    ],
    kids : [
      {num : "0", val : "0-4 Mos"},
      {num : "1", val : "6 Mos"},
      {num : "2", val : "8 Mos"},
      {num : "3", val : "10-12 Mos"},
      {num : "3.5", val : "1 Year"},
      {num : "4", val : "1.5 Year"},
      {num : "4.5", val : "2 Year"},
      {num : "5", val : "2 Year"},
      {num : "6", val : "2.5 Year"},
      {num : "7", val : "3 Year"},
      {num : "8", val : "3.5 Year"},
      {num : "9", val : "4 Year"},
      {num : "10", val : "5 Year"},
      {num : "11", val : "5 Year"},
      {num : "12", val : "5.5 Year"},
      {num : "13", val : "6 Year"},
      {num : "1", val : "6.5 Year"},
      {num : "2", val : "7 Year"},
      {num : "3", val : "7.5 Year"},
      {num : "4", val : "8 Year"},
      {num : "5", val : "9-10 Year"},
      {num : "6", val : "11-12 Year"},
      {num : "", val : "One size"},
      {num : "", val : "Others"},
      ]

  }



  constructor (public af : AngularFire, public auth : AuthService, public router : Router) {}


  followUser(userId) {
      this.af.database.object('/following/'+this.auth.userData.uid+"/"+userId)
      .set({following : true}).then((_data) => {
          }).catch((_error) => {
              console.log(_error)
          })

      this.af.database.object('/followers/'+userId +"/"+this.auth.userData.uid)
      .set({following : true}).then((_data) => {
          }).catch((_error) => {
              console.log(_error)
          })
          return false;
  }

  followBrand(brandId) {
      this.af.database.object('/followingBrand/'+this.auth.userData.uid+"/"+brandId)
      .set({following : true}).then((_data) => {
          }).catch((_error) => {
              console.log(_error)
          })
        return false;
  }

  unFollowBrand(brandId) {
    this.af.database.object('/followingBrand/'+this.auth.userData.uid+"/"+brandId)
    .set({following : false}).then((_data) => {
        }).catch((_error) => {
            console.log(_error)
        })
        return false;
  }

  goEditItem(itemId) {

    this.router.navigate(['/dashboard/editItem/'+itemId]);
    return false;
  }

  deleteItem(itemId, uid) {
    if(uid != this.auth.userData.uid)
      return;

    this.af.database.list('/items').remove(itemId).then((_data) => {
            this.router.navigate(['/home/all/']);
        }).catch((_error) => {
            console.log(_error)
        })
    return false;
  }

  makeGroupOfItems(photosArray, itemsPerPage) {

    var count = 1;
    var arrCount = 0;

    var groupPhotos = [];
    for(var i=0; i < photosArray.length; i++) {


      if(!groupPhotos[arrCount]) {
        groupPhotos[arrCount] = new Array();
      }


      if(count > itemsPerPage) {
        count = 1;
        arrCount++

        if(!groupPhotos[arrCount]) {

          groupPhotos[arrCount] = new Array();
        }

        count++
        groupPhotos[arrCount].push(photosArray[i])
      }else{

        groupPhotos[arrCount].push(photosArray[i])
        count++;
      }

    }
    return groupPhotos;
  }



  unFollowUser(userId) {
    this.af.database.object('/following/'+this.auth.userData.uid+"/"+userId)
    .set({following : false}).then((_data) => {
        }).catch((_error) => {
            console.log(_error)
        })

        this.af.database.object('/followers/'+userId +"/"+this.auth.userData.uid)
        .set({following : false}).then((_data) => {
            }).catch((_error) => {
                console.log(_error)
            })
            return false;
  }

  declineOffer(offerId, userId, itemKey) {
    this.af.database.object(`/offers/${offerId}`).update({status : 'declined'});
    this.af.database.list('/notifications/'+userId)
    .push({from : this.auth.userData.uid, type : "declineOffer", item : itemKey, timestamp : Math.floor((new Date()).getTime() / 1000)})
  }

  acceptOffer(offerId, userId, itemKey, offers, mainOffer) {
    console.log(mainOffer)

    for(var i=0; i < mainOffer.itemsToGet.length; i++) {
      this.af.database.object("items/"+ mainOffer.itemsToGet[i]).update({status : "inProcess"})
    }
    for(var i=0; i < mainOffer.itemsToOffer.length; i++) {
      this.af.database.object("items/"+ mainOffer.itemsToOffer[i]).update({status : "inProcess"})
    }


    this.af.database.object('/offers/'+offerId).take(1)
    .subscribe(offer => {

      console.log("here: ", offer);
      offer.itemsToOffer = []
      for (let acceptedItem in mainOffer.acceptedItems) {
        if(mainOffer.acceptedItems[acceptedItem] == true) {
          offer.itemsToOffer.push(acceptedItem);
        }
      }

      delete offer['$key'];
      delete offer['$exists'];
      delete offer['$value'];
      console.log("accept: ", offer);
      var inprocess = this.af.database.list('/inProcess')
      .push(offer).key;

      this.af.database.list('/notifications/'+offer.offerFrom)
      .push({from : this.auth.userData.uid, type : "acceptedOffer", item : itemKey, timestamp : Math.floor((new Date()).getTime() / 1000), inProcessId : inprocess})
      .then(res => {

        for(var i=0; i < mainOffer.length; i++) {
          console.log(mainOffer.itemsToGet[i]);
        }
        this.router.navigate(['/dashboard/inprocess/'+inprocess]);
      })

      this.af.database.list('/myInProcess/'+offer.offerFrom)
      .push({processId : inprocess});
      this.af.database.list('/myInProcess/'+offer.offerTo)
      .push({processId : inprocess});

       for (let item of offers) {
         if(item.$key == offerId) {
         }else{
           this.af.database.list('/notifications/'+item.offerFrom)
           .push({from : this.auth.userData.uid, type : "acceptedOther", item : itemKey, timestamp : Math.floor((new Date()).getTime() / 1000)})
         }

         this.af.database.list('/offers').remove(item.$key);
       }

    })
  }



  acceptOfferSunmool(offerId, mainOffer) {



      this.af.database.object("items/"+ mainOffer.item).update({status : "inProcess"})



    this.af.database.object('/sunmool/'+offerId).take(1)
    .subscribe(offer => {


      delete offer['$key'];
      delete offer['$exists'];
      delete offer['$value'];
      offer["type"] = "sunmool";
      var inprocess = this.af.database.list('/inProcess')
      .push(offer).key;

      this.af.database.list('/notifications/'+offer.offerFrom)
      .push({from : this.auth.userData.uid, type : "acceptedSunmool", item : mainOffer.item, timestamp : Math.floor((new Date()).getTime() / 1000), inProcessId : inprocess})
      .then(res => {

        this.router.navigate(['/dashboard/inprocess/'+inprocess]);
      })

      this.af.database.list('/myInProcess/'+offer.offerFrom)
      .push({processId : inprocess});
      this.af.database.list('/myInProcess/'+offer.offerTo)
      .push({processId : inprocess});

      //  for (let item of offers) {
      //    if(item.$key == offerId) {
      //    }else{
      //      this.af.database.list('/notifications/'+item.offerFrom)
      //      .push({from : this.auth.userData.uid, type : "acceptedOther", item : itemKey, timestamp : Math.floor((new Date()).getTime() / 1000)})
      //    }
       //
      //    this.af.database.list('/offers').remove(item.$key);
      //  }

    })
  }

  declineOfferSunmool(offerId, userId, itemKey) {
    this.af.database.object(`/sunmool/${offerId}`).update({status : 'declined'});
    this.af.database.list('/notifications/'+userId)
    .push({from : this.auth.userData.uid, type : "declineOfferSunmool", item : itemKey, timestamp : Math.floor((new Date()).getTime() / 1000)})
  }

  deleteOffer(offerId, userId, itemKey, offerStatus) {
    if(offerStatus && offerStatus == "declined") {

    }else{
      this.af.database.list('/notifications/'+userId)
      .push({from : this.auth.userData.uid, type : "deteleOffer", item : itemKey, timestamp : Math.floor((new Date()).getTime() / 1000)})
    }
    this.af.database.list(`/offers`).remove(offerId);
  }

  deleteOfferSunmool(offerId, userId, itemKey, offerStatus) {
    if(offerStatus && offerStatus == "declined") {

    }else{
      this.af.database.list('/notifications/'+userId)
      .push({from : this.auth.userData.uid, type : "deteleOfferSunmool", item : itemKey, timestamp : Math.floor((new Date()).getTime() / 1000)})
    }
    this.af.database.list(`/sunmool`).remove(offerId);
  }

  getLikesNum(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key) && key != '$exists' && key != "$key" && key != "$value" && obj[key].liked) size++;
    }
    return size;
  }


  likeItem(itemId) {
      this.af.database.object('/likes/'+itemId+"/"+this.auth.userData.uid)
      .set({liked : true}).then((_data) => {
          }).catch((_error) => {
              console.log(_error)
          })

          return false;
  }


  unLikeItem(itemId) {
      this.af.database.object('/likes/'+itemId+"/"+this.auth.userData.uid)
      .set({liked : false}).then((_data) => {
          }).catch((_error) => {
              console.log(_error)
          })
          return false;
  }

  viewItem(itemId) {
      this.router.navigate(['/itemDetails/'+itemId]);

      return false;
  }
  goPage(page) {
      this.router.navigate([page]);

      return false;
  }

  viewOfferOthersDetails(itemId) {
    this.router.navigate(['/dashboard/offers/others/details/'+itemId]);

    return false;
  }
  viewSunmoolOthersDetails(itemId) {
    this.router.navigate(['/dashboard/sunmool/others/details/'+itemId]);

    return false;
  }


  viewOfferMeDetails(itemId) {
    this.router.navigate(['/dashboard/offers/me/details/'+itemId]);

    return false;
  }

  viewSunmoolMeDetails(itemId) {
    this.router.navigate(['/dashboard/sunmool/me/details/'+itemId]);

    return false;
  }

  sendMessage(userId) {
      this.router.navigate(['/messages/'+userId]);

      return false;
  }


  time_ago(time){

  switch (typeof time) {
      case 'number': break;
      case 'string': time = +new Date(time); break;
      case 'object': if (time.constructor === Date) time = time.getTime(); break;
      default: time = +new Date();
  }
  var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
      token = 'ago', list_choice = 1;

  if (seconds == 0) {
      return 'Just now'
  }
  if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
  }
  var i = 0, format;
  while (format = time_formats[i++])
      if (seconds < format[0]) {
          if (typeof format[2] == 'string')
              return format[list_choice];
          else
              return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
  return time;
  }


}

export const COMMON_FUNCTIONS_PROVIDER = [
  CommonFunctions
];
