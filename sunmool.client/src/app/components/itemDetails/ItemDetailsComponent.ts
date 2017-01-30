import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../services/Auth/AuthService";
import {CommonFunctions} from "../../services/CommonFunctions";
@Component({
  selector: 'itm-cmpnt',
  styleUrls: ['./src/app/components/itemDetails/ItemDetails.css'],
  templateUrl: './src/app/components/itemDetails/ItemDetails.html',
})
export class ItemDetailsComponent {


  public lgimg;
  public pop;
  public popsun;
  public item;
  public items = [];
  public userInfo;

  public currentLoggedItems;
  public currentSelectedPhoto = "";
  public photoCarousel = [];

  public recentlyViewdPhotos = [];
  public photoViewdCarousel = [];
  public commentText = "";

  public itemComments;

  public comments = [];
  public recentlyViewed;


  public itemsSelected = {};
  public myItemsSelected = {};

  public itemsSelectedNum = 1;
  public myItemsSelectedNum = 0;

  public mySelectedArr = [];
  public mySelectedArrRaw = [];
  public itemPickNum = 0;
  public formInvalid = true;

  public offersNum = [];

  public carouselItems = [];

  public sunmoolStory = "";
  public storyOnBlogAccept = '';

  public similarItemsList = [];

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {

  }

  public hisSelectedArrRaw = [];
  public hisSelectedArr = [];
  selectItems (itemId, picture) {

    if(itemId == this.item.$key)
      return;

    this.hisSelectedArr = [];
    this.hisSelectedArrRaw = [];

    if(itemId == this.item.$key)
      return;
    if(this.itemsSelected[itemId]) {
      this.itemsSelected[itemId].val = false;
      this.itemsSelectedNum--;
    }else{
      this.itemsSelected[itemId] = {};
      this.itemsSelected[itemId].val = true;
      this.itemsSelected[itemId].picture = picture;
      this.itemsSelectedNum++;
    }
    var count = 0;

    console.log(this.itemsSelected)

    for(var i in this.itemsSelected) {
      console.log(this.itemsSelected[i])
      if(this.itemsSelected[i].val == true) {
        this.hisSelectedArrRaw.push(this.itemsSelected[i].picture)
      }
    }

    console.log(this.hisSelectedArrRaw)
    this.hisSelectedArr = this.common.makeGroupOfItems(this.hisSelectedArrRaw, 7);

  }

  getSimilarItems (categ, style, size) {
      var query = {
        "query": {
          "bool":{
            "must":[
              {
                "term":
                {
                  "category": categ
                }
              },
              {
                  "match":
                  {
                    "style": style
                  }
              },
              {
                  "match":
                  {
                    "size": size
                  }
              }
            ],
              "should":[
                {
                  "match":
                  {
                    "description":""
                  }
                }
                ,{
                  "match":
                  {
                    "title":""
                  }
                }
              ]
            }
          }
        }

        var request = this.af.database.list('/search/request').push({ index: 'firebase', type: 'item', query: query });

        this.af.database.object('/search/response/'+request.key).subscribe(result => {
          this.similarItemsList = [];
         if(result.total && result.total != 0 && result.hits.length > 0) {

           for(var i=0; i < result.hits.length; i++) {

             this.similarItemsList.push(result.hits[i]._source);
           }
         }else if(result.total == 0){
           //this.eventEmitter.searchFail(result);
         }




        });
  }


  changeItemPickNum(num){
    this.itemPickNum = num+1;
    return false;
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
      if(this.itemsSelected[i].val) {
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
      offerTo: this.item.uid,
      mainItem : this.item.$key,
      itemsToGet : itemsToGet,
      itemsToOffer : itemsToOffer,
      itemsToPick : this.itemPickNum,
      timestamp : Math.floor((new Date()).getTime() / 1000)
    };
    this.af.database.list(`/offers/`).push(offer).then(res => {
      this.af.database.list('/notifications/'+this.userInfo.$key)
      .push({from : this.auth.userData.uid, type : "offer", item : this.item.$key, timestamp : offer.timestamp, numOffers : offer.itemsToOffer.length}).then(res => {
        this.router.navigate(['/dashboard/offers/others/details/'+this.item.$key]);
      })
    });

    this.itemPickNum = 0;
    this.mySelectedArr = [];
    this.myItemsSelected = {};
    this.offerOpen();
  }

  postSunmoolOffer() {
    var offer = {
      offerFrom : this.auth.userData.uid,
      offerTo : this.item.uid,
      item : this.item.$key,
      story : this.sunmoolStory,
      blogAccept : this.storyOnBlogAccept,
      timestamp : Math.floor((new Date()).getTime() / 1000)
    }

    this.af.database.list(`/sunmool/`).push(offer).then(res => {
      this.af.database.list('/notifications/'+this.userInfo.$key)
      .push({from : this.auth.userData.uid, type : "sunmoolRequest", item : this.item.$key, timestamp : offer.timestamp}).then(res => {
        this.router.navigate(['/dashboard/sunmool/others/details/'+this.item.$key]);
      })
    });
    this.sunmoolStory = "";
    this.storyOnBlogAccept = '';
    this.sunmoolOpen();
  }

  storyOnBlog(val) {
    this.storyOnBlogAccept = val;

    return false;
  }

  sunmoolOpen() {
    if(!this.popsun) { this.popsun = true }else{this.popsun= false}
    //this.notify.emit(this.popsun);

    return false;
  }

  offerOpen() {
    if(!this.pop) { this.pop = true }else{this.pop= false}
    //this.notify.emit(this.pop);

    return false;
  }

    imageOpen() {
        if(!this.lgimg) { this.lgimg = true }else{this.lgimg= false}
        return false;
    }



  sendNewMessage(userId) {

    var messageToSend = "Hi, i am interested in your item!"


      var chatKey = "";
      //initialize new chat if does not exist
      this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+userId).take(1).subscribe(userChat => {
          if(!userChat.$exists()) {
            chatKey = this.guid();

            this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+userId).set({newMessages : false, noMessages : false, chatKey : chatKey, timestamp : Math.floor((new Date()).getTime() / 1000) }).then(res =>{

              this.af.database.object('/chats/'+chatKey+"/users").set({user1 : this.auth.userData.uid, user2 : userId}).then(() => {
                this.af.database.object('/myMessages/'+userId+"/"+this.auth.userData.uid ).set({newMessages : false, noMessages : true, chatKey : chatKey, timestamp : Math.floor((new Date()).getTime() / 1000) }).then(res =>{


                  this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+userId).take(1).subscribe(mymesg => {
                    var chatKey = mymesg.chatKey;

                    this.af.database.list('/chats/'+chatKey+"/messages").push({message : messageToSend, uid : this.auth.userData.uid, timestamp : Math.floor((new Date()).getTime() / 1000), type : "simpleMessage" });
                    this.af.database.object('/myMessages/'+userId+"/"+this.auth.userData.uid).update({noMessages : false, newMessages : true});
                    messageToSend = "";

                    this.af.database.list('/chats/'+chatKey+"/messages").push({itemId: this.item.$key, uid : this.auth.userData.uid, timestamp : Math.floor((new Date()).getTime() / 1000), type : "itemDetail"});
                    this.af.database.object('/myMessages/'+userId+"/"+this.auth.userData.uid).update({noMessages : false, newMessages : true});

                    this.router.navigate(['/messages/'+userId]);
                  })



                })
              });
            })
          }else{
            this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+userId).update({timestamp : Math.floor((new Date()).getTime() / 1000)});
            this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+userId).update({noMessages : false, newMessages : false});
            this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+userId).take(1).subscribe(mymesg => {
              chatKey = mymesg.chatKey;



              this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+userId).take(1).subscribe(mymesg => {
                var chatKey = mymesg.chatKey;

                this.af.database.list('/chats/'+chatKey+"/messages").push({message : messageToSend, uid : this.auth.userData.uid, timestamp : Math.floor((new Date()).getTime() / 1000), type : "simpleMessage" });
                this.af.database.object('/myMessages/'+userId+"/"+this.auth.userData.uid).update({noMessages : false, newMessages : true});
                messageToSend = "";

                this.af.database.list('/chats/'+chatKey+"/messages").push({itemId: this.item.$key, uid : this.auth.userData.uid, timestamp : Math.floor((new Date()).getTime() / 1000), type : "itemDetail"});
                this.af.database.object('/myMessages/'+userId+"/"+this.auth.userData.uid).update({noMessages : false, newMessages : true});

                this.router.navigate(['/messages/'+userId]);
              })




            })
          }
       });






    return false;
  }



  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


  changePicture(pic) {
    this.currentSelectedPhoto = pic;
    return false;
  }

  saveComment() {
    if(this.commentText != "") {
        var post = {userId : this.auth.userData.auth.uid, timestamp : Math.floor((new Date()).getTime() / 1000), comment : this.commentText };
      this.itemComments.push(post).then((_data) => {
              this.commentText = "";

              if(this.userInfo.$key !=  this.auth.userData.uid) {
                this.af.database.list('/notifications/'+this.userInfo.$key)
                .push({from : this.auth.userData.uid, type : "comment", item : this.item.$key, timestamp : Math.floor((new Date()).getTime() / 1000)}).then((_data) => {
                        this.commentText = "";
                    }).catch((_error) => {
                        console.log(_error)
                    })
              }

          }).catch((_error) => {
              console.log(_error)
          })



    }
    return false;
  }

  favoriteItem (itemId) {
    this.af.database.object('/favorites/'+this.auth.userData.uid+"/"+itemId+"/")
    .set({favorite : true}).then((_data) => {
        }).catch((_error) => {
            console.log(_error)
        })
  }

  unFavoriteItem (itemId) {
    this.af.database.object('/favorites/'+this.auth.userData.uid+"/"+itemId+"/")
    .set({favorite : false}).then((_data) => {
        }).catch((_error) => {
            console.log(_error)
        })
  }

  ngOnInit() {


  this.route.params.subscribe(params => {
      if (params['id'] && this.auth.userData != null) {
        this.itemComments = this.af.database.list('/comments/'+params['id']);
        //--------------------------------------get comments ----
        var queryList = this.af.database.list('/comments/'+params['id'], {
          query: {
            limitToLast: 20,
            orderByKey: true
          }
        }).map(items => {
        for (let item of items) {
          // Find each corresponding associated object and store it as a FibreaseObjectObservable
          this.af.database.object(`/users/${item.userId}`).subscribe(user => {
            item.user = user;
          });
        }

        return items;
      });


      queryList.subscribe(res => {
        this.comments = res;
      });
        //---------------------------------end get comments


        //-------------------mark item as viewed
        var timestamp = Math.floor((new Date()).getTime() / 1000);
        var itemViewToAdd = {
          view : true,
          timestamp : timestamp
        };

        var viewItem = this.af.database.object("viewedItems/" + this.auth.userData.uid+"/"+params['id']);

        viewItem.set(itemViewToAdd).then((_data) => {
            }).catch((_error) => {
                console.log(_error)
            })
        //-------------------end mark item as viewed




        //-------------------get viewed items
        var viewdItems = this.af.database.list('/viewedItems/'+this.auth.userData.uid, {
          query: {
            orderByChild: 'timestamp',
            limitToLast: 8

          }
        }).take(1).map(items => {
        for (let item of items) {
          // Find each corresponding associated object and store it as a FibreaseObjectObservable
          this.af.database.object(`/items/${item.$key}`).subscribe(user => {
            item.user = user;
          });
        }

        return items.reverse();
      });


      viewdItems.subscribe(res => {
        for(var i=0; i < res.length; i++) {
          if(res[i].user && res[i].user.photos)
          {
            this.recentlyViewdPhotos.push({photo : res[i].user.photos[0], itemId : res[i].$key});
          }else{
            this.recentlyViewdPhotos.push( {photo : '', itemId : res[i].$key});
          }

        }
        this.photoViewdCarousel = this.common.makeGroupOfItems(this.recentlyViewdPhotos, 4);
      });
        //-------------------end get viewed items






        //
        this.item = this.af.database.object('/items/'+params['id']).take(1);

        this.item
        .subscribe(snapshot => {
             this.item = snapshot;

             this.getSimilarItems(snapshot.category, snapshot.style, snapshot.size)

             this.itemsSelected[this.item.$key] = {};
             this.itemsSelected[this.item.$key]['val'] = true;
             this.itemsSelected[this.item.$key]['picture'] = this.item.photos[0];

             console.log('this item is sunmool:', this.item.sunmool)
             if(this.item.sunmool) {
               this.af.database.list('/sunmool', {
                 query: {
                   orderByChild: 'item',
                   equalTo: snapshot.$key
                 }
               }).subscribe(offers => {
                 this.offersNum = offers;
               })
             }else{
               this.af.database.list('/offers', {
                 query: {
                   orderByChild: 'mainItem',
                   equalTo: snapshot.$key
                 }
               }).subscribe(offers => {
                 this.offersNum = offers;
               })
             }


             this.af.database.object(`/likes/${snapshot.$key}`).subscribe(likes => {
               snapshot.likes = likes;
             });

             this.af.database.object(`/favorites/${this.auth.userData.uid}/${snapshot.$key}`).subscribe(favorite => {
               snapshot.favorite = favorite.favorite;
             });

             this.photoCarousel = this.common.makeGroupOfItems(this.item.photos,3);
             if(this.photoCarousel.length != 0)
             this.currentSelectedPhoto = this.photoCarousel[0][0];

             //get current selected user items
             this.af.database.list('/items', {
                query: {
                  orderByChild: 'uid',
                  equalTo: snapshot.uid
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
                         this.items = myItems;


                         this.carouselItems = [];

                           for(let itm of myItems) {
                             if(!itm.sunmool) {
                               if(itm.status != "inProcess")
                                this.carouselItems.push(itm);
                             }
                           }
                                  this.carouselItems = this.common.makeGroupOfItems(this.carouselItems, 4);
              });
              this.af.database.object('/users/'+snapshot.uid).take(1).subscribe(userInfo => {
                          this.userInfo = userInfo;
               });



               //get current logged in user items
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
                  this.currentLoggedItems = [];

                    for(let itm of myItems) {
                      if(!itm.sunmool) {
                        if(itm.status != "inProcess")
                         this.currentLoggedItems.push(itm);

                      }
                    }
                           this.currentLoggedItems = this.common.makeGroupOfItems(this.currentLoggedItems, 4);

                });



        })
      }
    });


  }

}
