// import "./polyfills.ts";
import { HomeComponent } from './components/home/HomeComponent';
import { AllNotificationsComponent } from './components/allNotifications/AllNotificationsComponent';
import { UserProfileComponent } from './components/userProfile/UserProfileComponent';
import { LoginComponent } from './components/login/LoginComponent';
import { DashboardComponent } from './components/dashboard/DashboardComponent';
import { ProfileComponent } from './components/dashboard/pages/profile/ProfileComponent';


import { ItemDetailsComponent } from './components/itemDetails/ItemDetailsComponent';
import { MessagesComponent } from './components/messages/MessagesComponent';

import { ItemsComponent } from './components/dashboard/pages/items/ItemsComponent';


import { ProfileItemsComponent } from './components/userProfile/pages/items/ProfileItemsComponent';
import { ProfileFollowersComponent } from './components/userProfile/pages/followers/ProfileFollowersComponent';
import { ProfileFollowingComponent } from './components/userProfile/pages/following/ProfileFollowingComponent';
import { ProfileFavoritesComponent } from './components/userProfile/pages/favorites/ProfileFavoritesComponent';
import { ProfileBrandsComponent } from './components/userProfile/pages/brands/ProfileBrandsComponent';



import {BrandSearchComponent} from'./components/brandSearch/BrandSearchComponent';
import {InvitesComponent} from './components/invites/InvitesComponent';
import {EditProfileComponent} from './components/dashboard/pages/editProfile/EditProfileComponent';
import {NotificationComponent} from './components/dashboard/pages/notification/NotificationComponent';
import {PaymentComponent} from './components/dashboard/pages/payment/PaymentComponent';
import {PersonalizationComponent} from './components/dashboard/pages/personalization/PersonalizationComponent';
import {PrivacyComponent} from './components/dashboard/pages/privacy/PrivacyComponent';
import {InProcessComponent} from './components/dashboard/pages/inprocess/InProcessComponent';
import {InProcessTransactionComponent} from './components/dashboard/pages/inprocess/singleTransaction/InProcessTransactionComponent';
import{HistoryComponent} from './components/dashboard/pages/history/HistoryComponent';
import {MyItemsComponent} from'./components/dashboard/pages/myItems/MyItemsComponent';
import {EditItemComponent} from './components/dashboard/pages/editItem/EditItemComponent';
import {OfferToMeComponent} from './components/dashboard/pages/tome/OfferToMeComponent';
import {ToMeDetailsComponent} from './components/dashboard/pages/tome/toMeDetails/ToMeDetailsComponent';
import {OfferToOthersComponent} from './components/dashboard/pages/toothers/OfferToOthersComponent';
import {ToOthersDetailsComponent} from './components/dashboard/pages/toothers/toOthersDetails/ToOthersDetailsComponent';
import {SunmoolToMeComponent} from './components/dashboard/pages/sunmooltome/SunmoolToMeComponent';
import {SunmoolToMeDetailsComponent} from './components/dashboard/pages/sunmooltome/toMeDetails/SunmoolToMeDetailsComponent';
import {SunmoolToOthersComponent} from './components/dashboard/pages/sunmooltoothers/SunmoolToOthersComponent';
import {SunmoolToOthersDetailsComponent} from './components/dashboard/pages/sunmooltoothers/toOthersDetails/SunmoolToOthersDetailsComponent';
import {NavComponent} from './components/nav/NavComponent';
import {MainLoginComponent} from './components/login/main/MainLoginComponent';
import {SigninComponent} from './components/login/signin/SigninComponent';
import {SignupComponent} from './components/login/signup/SignupComponent'; 
import {FileSelectDirective } from 'ng2-file-upload';

import { SunmoolApp } from './app.component';
import { routing } from './services/SunmoolRoutes';
import { LocationStrategy,
         HashLocationStrategy } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AUTH_GUARD_PROVIDERS } from './services/Auth/AuthGuard';
import { AUTH_SERVICE_PROVIDER } from './services/Auth/AuthService';
import { STRIPE_SERVICE_PROVIDER } from './services/payment/StripeService';
import { VARIABLE_SERVICE_PROVIDER } from './services/variables';
import { SOCKET_SERVICE_PROVIDER } from './services/SocketService';
import { COMMON_FUNCTIONS_PROVIDER } from './services/CommonFunctions';

import {FIREBASE_PROVIDERS,
  defaultFirebase,
  AngularFire,
  AuthMethods,
  AuthProviders,
  firebaseAuthConfig,AngularFireModule} from 'angularfire2';


import {RouterModule} from '@angular/router';

import { EVENTS_PROVIDER } from './services/Auth/Events';






import { NgModule }       from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@NgModule({
    declarations: [SunmoolApp,FileSelectDirective,SigninComponent,SignupComponent,MainLoginComponent,NavComponent,HomeComponent,BrandSearchComponent,InvitesComponent, AllNotificationsComponent, UserProfileComponent, LoginComponent, DashboardComponent, ProfileComponent, ItemsComponent, ProfileItemsComponent, ProfileFollowersComponent, ProfileFollowingComponent, ProfileFavoritesComponent, ProfileBrandsComponent,ToOthersDetailsComponent,SunmoolToOthersDetailsComponent,SunmoolToOthersComponent,OfferToOthersComponent,ToMeDetailsComponent,OfferToMeComponent,EditItemComponent,MyItemsComponent,InProcessTransactionComponent,HistoryComponent,PersonalizationComponent,InProcessComponent,PrivacyComponent,PaymentComponent,NotificationComponent,SunmoolToMeDetailsComponent,EditProfileComponent,SunmoolToMeComponent ,ItemDetailsComponent, MessagesComponent],
    imports:      [BrowserModule,RouterModule,routing,FormsModule,HttpModule,AngularFireModule.initializeApp({apiKey: "AIzaSyCehO03pmYfboXs-YCBUMHN_nPZxqBKlpo",
      authDomain: "sunmooldev.firebaseapp.com",
      databaseURL: "https://sunmooldev.firebaseio.com",
      storageBucket: "sunmooldev.appspot.com"})],
    bootstrap:    [SunmoolApp],
    providers: [AUTH_GUARD_PROVIDERS, VARIABLE_SERVICE_PROVIDER, AUTH_SERVICE_PROVIDER, STRIPE_SERVICE_PROVIDER, EVENTS_PROVIDER, SOCKET_SERVICE_PROVIDER, FIREBASE_PROVIDERS, defaultFirebase({
      apiKey: "AIzaSyCehO03pmYfboXs-YCBUMHN_nPZxqBKlpo",
      authDomain: "sunmooldev.firebaseapp.com",
      databaseURL: "https://sunmooldev.firebaseio.com",
      storageBucket: "sunmooldev.appspot.com",



      }), { provide: LocationStrategy, useClass: HashLocationStrategy }, COMMON_FUNCTIONS_PROVIDER,]
})
export class AppModule {
  
}