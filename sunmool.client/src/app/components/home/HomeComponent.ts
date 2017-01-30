import { Component } from '@angular/core';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../services/variables';
import { Router, ActivatedRoute} from '@angular/router';
import {AuthService} from "../../services/Auth/AuthService";
import {CommonFunctions} from "../../services/CommonFunctions";
import {Observable} from 'rxjs/Rx';

import { Events } from '../../services/Auth/Events';

import 'rxjs/add/operator/take'
@Component({
  selector: 'home-cmpnt',
  styleUrls: ['./src/app/components/home/Home.css'],
  templateUrl: './src/app/components/home/Home.html',
})





export class HomeComponent {

  public queryList;
  public items = [];

  public recentlyViewdPhotos = [];
  public photoViewdCarousel = [];

  public searchTerm =""

  public searchOn = false;
  public successRef;
  public failRef;

  constructor(public af : AngularFire, public configVars : VariableService, public router : Router, public auth : AuthService, public route: ActivatedRoute, private events : Events, public common : CommonFunctions) {
    this.events.searchStatuslEvent.subscribe( res => {
      this.searchOn = res
    });
    this.searchTerm = "";
  }

  ngOnDestroy() {
    if(this.failRef)
    this.failRef.unsubscribe();
    if(this.successRef)
    this.successRef.unsubscribe();

  }
  ngOnInit() {
    this.searchTerm = "";
    this.route.params.subscribe(params => {
        if (params['category'] && this.auth.userData != null && params['category'] != "search") {

          if(this.failRef)
          this.failRef.unsubscribe();
          if(this.successRef)
          this.successRef.unsubscribe();

          var categ;

          if(params['category'] != 'all') {

            if(params['style']) {
              categ =  {
                limitToLast: 100,
                orderByChild: 'style',
                equalTo: params['style']
              }
            }else{
              categ =  {
                limitToLast: 100,
                orderByChild: 'category',
                equalTo: params['category']
              }
            }

          }else{
            this.searchTerm = "";
            categ =  {
              limitToLast: 100,
              orderByKey: true
            }
          }


          this.queryList = this.af.database.list('/items', {
            query: categ
          }).map(items => {
          for (let item of items) {
            // Find each corresponding associated object and store it as a FibreaseObjectObservable
            this.af.database.object(`/users/${item.uid}`).take(1).subscribe(user => {
              item.user = user;
            });

            this.af.database.object(`/likes/${item.$key}`).subscribe(likes => {
              item.likes = likes;
            });

          }

          return items;
        });



          this.queryList.subscribe(res => {
            this.items = res.reverse();
          });





          //-------------------get viewed items
          if(this.auth.userData != null) {


          var viewdItems = this.af.database.list('/viewedItems/'+this.auth.userData.uid, {
            query: {
              orderByChild: 'timestamp',
              limitToLast: 8
            }
          }).take(1).map(items => {
          for (let item of items) {
            // Find each corresponding associated object and store it as a FibreaseObjectObservable
            this.af.database.object(`/items/${item.$key}`).take(1).subscribe(itemDetails => {
              item.itemDetails = itemDetails;
            });
          }
          return items.reverse();
        });


        viewdItems.subscribe(res => {
          for(var i=0; i < res.length; i++) {

            if(res[i].itemDetails && res[i].itemDetails.photos)
            {
              this.recentlyViewdPhotos.push({photo : res[i].itemDetails.photos[0], itemId : res[i].$key});
            }else{
              this.recentlyViewdPhotos.push( {photo : '', itemId : res[i].$key});
            }

          }
          this.photoViewdCarousel = this.common.makeGroupOfItems(this.recentlyViewdPhotos, 4);

        });

        }
          //-------------------end get viewed items





        }else if(params['category'] == "search") {

          var self = this;
//          this.items = [];

          this.successRef = this.events.searchSuccessEvent.subscribe( res => {
            this.searchTerm = res.searchTerm;
            this.items = [];
            for(var i=0; i< res.hits.length; i++) {
              res.hits[i]._source.$key = res.hits[i]._id;
              self.items.push(res.hits[i]._source)
            }

            this.items = this.items.map(item => {
              // Find each corresponding associated object and store it as a FibreaseObjectObservable
              this.af.database.object(`/users/${item.uid}`).take(1).subscribe(user => {
                item.user = user;
              });

              this.af.database.object(`/likes/${item.$key}`).subscribe(likes => {
                item.likes = likes;
              });


            return item;
          });
          });


          //-------------------get viewed items
          if(this.auth.userData != null) {


          var viewdItems = this.af.database.list('/viewedItems/'+this.auth.userData.uid, {
            query: {
              orderByChild: 'timestamp',
              limitToLast: 8
            }
          }).take(1).map(items => {
          for (let item of items) {
            // Find each corresponding associated object and store it as a FibreaseObjectObservable
            this.af.database.object(`/items/${item.$key}`).take(1).subscribe(itemDetails => {
              item.itemDetails = itemDetails;
            });
          }

          return items.reverse();
        });


        viewdItems.subscribe(res => {
          for(var i=0; i < res.length; i++) {

            if(res[i].itemDetails && res[i].itemDetails.photos)
            {
              this.recentlyViewdPhotos.push({photo : res[i].itemDetails.photos[0], itemId : res[i].$key});
            }else{
              this.recentlyViewdPhotos.push( {photo : '', itemId : res[i].$key});
            }

          }
            this.photoViewdCarousel = this.common.makeGroupOfItems(this.recentlyViewdPhotos, 4);

        });
        }
          //-------------------end get viewed items
          this.failRef = this.events.searchFailEvent.subscribe( res => {
            this.searchTerm = res.searchTerm;
            this.items = [];

          });
        }
      });
   }








}
