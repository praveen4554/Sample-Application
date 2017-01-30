import { Component, Output, EventEmitter } from '@angular/core';
import {  Router, NavigationStart} from '@angular/router';
import { AuthService } from '../../services/Auth/AuthService';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Events}    from '../../services/Auth/Events';


import { VariableService } from '../../services/variables';
@Component({
  selector: 'nav-cmpnt',
  styleUrls: ['./src/app/components/nav/Nav.css'],
  templateUrl: './src/app/components/nav/Nav.html'

  //host: {'(window:scroll)': 'track($event)'},

  //directives: [ROUTER_DIRECTIVES]
})
export class NavComponent {

  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

  public opened;
  public search = false;
  public userData = null;

  public categoryFilter = 'Category';
  public sizeFilter = 'Size';
  public brandFilter = 'Brand';
  public colorFilter = 'Color';
  public conditionFilter = 'Condition';
  public nearMeFilter = 'Near me';
  public sunmoolFilter = 'Sunmool';

  public searchStr = '';


  public notifications = [];

  public unreadNotifications = 0;
  public unreadMessages = 0;

  public userInfo = {};

  public conditionList = [];
hightlightStatus: Array<boolean> = [];
  
  constructor(private auth : AuthService, public af: AngularFire, public configVars : VariableService, private eventEmitter : Events, public router : Router) {

  
    this.af.database.list("/staticData/condition")
    .subscribe(res => {
      this.conditionList = res;
    })


    router.events.forEach((event) => {
    if(event instanceof NavigationStart) {
      console.log(event);
      this.searchClose();
    }

  });

    this.af.auth.subscribe(auth => {
      if(auth != null) {
        this.userData = auth;
      }else{
        this.userData = null;
      }
    });

    if(this.auth.userData)
    this.af.database.object('/users/'+this.auth.userData.uid).take(1).subscribe(userInfo => {
                this.userInfo = userInfo;
     });


    router.events.subscribe(event => {
      console.log(event.url);
      if(event.url && event.url.indexOf("home") != -1)
        this.eventEmitter.toggleSearch(this.search)
    });


    if(this.auth.userData != null) {

      this.af.database.list('/myMessages/'+this.auth.userData.uid).subscribe(chats => {
        this.unreadMessages = 0;
        for(let chat of chats) {
          if(chat.newMessages) {
            this.unreadMessages++;
          }
        }
      })

      var notifications = this.af.database.list('/notifications/'+this.auth.userData.uid, {
        query: {
          limitToLast: 100,
          orderByKey: true
        }
      }).map(items => {
        this.unreadNotifications = 0;
      for (let item of items) {
        // Find each corresponding associated object and store it as a FibreaseObjectObservable
        this.af.database.object(`/users/${item.from}`).subscribe(user => {
          item.user = user;
        });
        this.af.database.object(`/items/${item.item}`).subscribe(itemDetails => {
          item.itemDetails = itemDetails;
          if(item && !item.read && item.itemDetails.$exists()) {
            this.unreadNotifications++;
          }
        });
      }

      return items;
    });



    notifications.subscribe(res => {
      this.notifications = res.reverse();
    });
    }



  }


  changeCategory(categ) {
    this.categoryFilter = categ;
    this.searchItem('firebase', 'item', this.searchStr, null);
    return false;
  }

  changeSize(size) {
    this.sizeFilter = size;
    this.searchItem('firebase', 'item', this.searchStr, null);
    return false;
  }

  changeBrand(brand) {
    this.brandFilter = brand;
    this.searchItem('firebase', 'item', this.searchStr, null);
    return false;
  }

  changeColor(color) {
    this.colorFilter = color;
    this.searchItem('firebase', 'item', this.searchStr, null);
    return false;
  }

  changeCondition(condition) {
    this.conditionFilter = condition;
    this.searchItem('firebase', 'item', this.searchStr, null);
    return false;
  }

  changeSunmool(sunmool) {
    this.sunmoolFilter = sunmool;
    this.searchItem('firebase', 'item', this.searchStr, null);
    return false;
  }

  changeNearMe(nearMe) {
    this.nearMeFilter = nearMe;

    return false;
  }


  public offerSubVisible = false;
  toggleOffersSub() {
    this.offerSubVisible = !this.offerSubVisible;
    return false;
  }

  public sunmoolSubVisible = false;
  toggleSunmoolSub() {
    this.sunmoolSubVisible = !this.sunmoolSubVisible;
    return false;
  }

  public settingsSubVisible = false;
  toggleSettingsSub() {
    this.settingsSubVisible = !this.settingsSubVisible;
    return false;
  }
  searchItem(index, type, searchTerm, event) {
    if((event && event.code != "Enter"))
    {
      return;
    }

      if(!searchTerm)
        searchTerm = "";


//      this.router.navigate(['/home/search']);
      var categ = "dresses";
      var toAdd = [];
      if(this.categoryFilter != "Category") {
          toAdd.push({ "term": { "category":  this.categoryFilter }});
      }

      if(this.brandFilter != "Brand") {
        toAdd.push({ "match": { "brandName":  "'"+this.brandFilter+"'" }});
      }

      if(this.sizeFilter != "Size") {
        toAdd.push({ "match": { "size":  "'"+this.sizeFilter+"'" }});
      }


      if(this.colorFilter != "Color") {
        toAdd.push({ "match": { "colors":  this.colorFilter }});
      }
      if(this.conditionFilter != "Condition") {
        toAdd.push({ "match": { "condition":  this.conditionFilter }});
      }
      if(this.nearMeFilter != "Near me") {
        toAdd.push({ "match": { "nearMe":  "'"+this.nearMeFilter+"'" }});
      }
      if(this.sunmoolFilter != "Sunmool" && this.sunmoolFilter) {
        toAdd.push({ "match": { "sunmool":  this.sunmoolFilter }});
      }


      var query ={
        "query" :{

          "bool": {
            "must" : toAdd,

            "should": [
              { "match": { "description":  searchTerm }},
              { "match": { "title": searchTerm   }}
            ]
          }


        }
      }


       var request = this.af.database.list('/search/request').push({ index: index, type: type, query: query });

       this.af.database.object('/search/response/'+request.key).subscribe(result => {

        result.searchTerm = searchTerm;
        if(result.total && result.total != 0) {
          this.eventEmitter.searchSuccess(result);
        }else if(result.total == 0){
          this.eventEmitter.searchFail(result);
        }



       });
    }

  markAsRead(notificationId) {
    this.af.database.object('/notifications/'+this.auth.userData.uid+"/"+notificationId)
    .update({read : true}).then((_data) => {
        }).catch((_error) => {
            console.log(_error)
        })
  }

  searchOpen() {
    if(!this.search) {
      this.router.navigate(['./home/search']);
      this.search = true
    }else{
      ///this.search = false
    }

    this.eventEmitter.toggleSearch(this.search)
    return false;
  }
  searchClose() {
     this.search = false


    this.eventEmitter.toggleSearch(this.search)
    return false;
  }
  openMenu() {
    if(!this.opened) { this.opened = true }else{this.opened= false}
    this.notify.emit(this.opened);

    return false;
  }

  closeMenu() {
    this.opened = false;
    this.notify.emit(this.opened);
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


  logout() {
    this.opened = false;
    this.notify.emit(this.opened);
    this.auth.logout();
  }
}
