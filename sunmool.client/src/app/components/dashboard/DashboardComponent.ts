import { Component } from '@angular/core';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../services/variables';
import { Router, ActivatedRoute} from '@angular/router';
import {AuthService} from "../../services/Auth/AuthService";
import {CommonFunctions} from "../../services/CommonFunctions";
import {Observable} from 'rxjs/Rx';

import { Events } from '../../services/Auth/Events';
@Component({
  selector: 'dash-cmpnt',
  styleUrls: ['./src/app/components/dashboard/Dashboard.css'],
  templateUrl: './src/app/components/dashboard/Dashboard.html',
})
export class DashboardComponent {

   public open = false;
   public sunmoolOpen = false;
   public settingsOpen = false;

   public currentRoute = "";

   offersMenu() {
     if(!this.open) {
       this.open = true
     }else{
       this.open = false
     }
     return false;
   }

   sunmoolMenu() {
     if(!this.sunmoolOpen) {
       this.sunmoolOpen = true
     }else{
       this.sunmoolOpen = false
     }
     return false;
   }

   settingsMenu() {
     if(!this.settingsOpen) {
       this.settingsOpen = true
     }else{
       this.settingsOpen = false
     }
     return false;
   }


  constructor(public af : AngularFire, public configVars : VariableService, public router : Router, public auth : AuthService, public route: ActivatedRoute, private events : Events, public common : CommonFunctions) {

    router.events.forEach((event) => {
      if(this.router.url.indexOf("myItems") != -1) {
        this.currentRoute = 'items';
      }else if(this.router.url.indexOf("offers/me") != -1) {
        this.open = true
        this.currentRoute = 'offersIncomming';
      }else if(this.router.url.indexOf("offers/others") != -1) {
        this.open = true
        this.currentRoute = 'offersOutgoing';
      }else if(this.router.url.indexOf("sunmool/me") != -1) {
        this.sunmoolOpen = true
        this.currentRoute = 'sunmoolIncomming';
      }else if(this.router.url.indexOf("sunmool/others") != -1) {
        this.sunmoolOpen = true
        this.currentRoute = 'sunmoolOutgoing';
      }else if(this.router.url.indexOf("editProfile") != -1) {
        this.settingsOpen = true
        this.currentRoute = 'profileDetails';
      }else if(this.router.url.indexOf("payment") != -1) {
        this.settingsOpen = true
        this.currentRoute = 'payment';
      }else if(this.router.url.indexOf("personalization") != -1) {
        this.settingsOpen = true
        this.currentRoute = 'personalization';
      }else if(this.router.url.indexOf("notification") != -1) {
        this.settingsOpen = true
        this.currentRoute = 'notification';
      }else if(this.router.url.indexOf("privacy") != -1) {
        this.settingsOpen = true
        this.currentRoute = 'privacy';
      }else if(this.router.url.indexOf("inprocess") != -1) {
        this.currentRoute = 'inProcess';
      }
  });



  }

}
