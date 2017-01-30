import { HomeComponent } from '../components/home/HomeComponent';
import { BrandSearchComponent } from '../components/brandSearch/BrandSearchComponent';
import { AllNotificationsComponent } from '../components/allNotifications/AllNotificationsComponent';

import { InvitesComponent } from '../components/invites/InvitesComponent';
import { UserProfileComponent } from '../components/userProfile/UserProfileComponent';
import { LoginComponent } from '../components/login/LoginComponent';
import { DashboardComponent } from '../components/dashboard/DashboardComponent';
import { ItemDetailsComponent } from '../components/itemDetails/ItemDetailsComponent';
import { ProfileComponent } from '../components/dashboard/pages/profile/ProfileComponent';
import { ItemsComponent } from '../components/dashboard/pages/items/ItemsComponent';
import { EditItemComponent } from '../components/dashboard/pages/editItem/EditItemComponent';

import { MyItemsComponent } from '../components/dashboard/pages/myItems/MyItemsComponent';
import { EditProfileComponent } from '../components/dashboard/pages/editProfile/EditProfileComponent';
import { NotificationComponent } from '../components/dashboard/pages/notification/NotificationComponent';
import { PaymentComponent } from '../components/dashboard/pages/payment/PaymentComponent';
import { PersonalizationComponent } from '../components/dashboard/pages/personalization/PersonalizationComponent';
import { PrivacyComponent } from '../components/dashboard/pages/privacy/PrivacyComponent';
import { InProcessComponent } from '../components/dashboard/pages/inprocess/InProcessComponent';


import { InProcessTransactionComponent } from '../components/dashboard/pages/inprocess/singleTransaction/InProcessTransactionComponent';
import { HistoryComponent } from '../components/dashboard/pages/history/HistoryComponent';

import { OfferToMeComponent } from '../components/dashboard/pages/tome/OfferToMeComponent';
import { ToMeDetailsComponent } from '../components/dashboard/pages/tome/toMeDetails/ToMeDetailsComponent';

import { OfferToOthersComponent } from '../components/dashboard/pages/toothers/OfferToOthersComponent';
import { ToOthersDetailsComponent } from '../components/dashboard/pages/toothers/toOthersDetails/ToOthersDetailsComponent';


import { SunmoolToMeComponent } from '../components/dashboard/pages/sunmooltome/SunmoolToMeComponent';
import { SunmoolToMeDetailsComponent } from '../components/dashboard/pages/sunmooltome/toMeDetails/SunmoolToMeDetailsComponent';

import { SunmoolToOthersComponent } from '../components/dashboard/pages/sunmooltoothers/SunmoolToOthersComponent';
import { SunmoolToOthersDetailsComponent } from '../components/dashboard/pages/sunmooltoothers/toOthersDetails/SunmoolToOthersDetailsComponent';


import { ProfileItemsComponent } from '../components/userProfile/pages/items/ProfileItemsComponent';
import { ProfileFavoritesComponent } from '../components/userProfile/pages/favorites/ProfileFavoritesComponent';
import { ProfileFollowersComponent } from '../components/userProfile/pages/followers/ProfileFollowersComponent';
import { ProfileFollowingComponent } from '../components/userProfile/pages/following/ProfileFollowingComponent';
import { ProfileBrandsComponent } from '../components/userProfile/pages/brands/ProfileBrandsComponent';
import { MessagesComponent } from '../components/messages/MessagesComponent';


import { AuthGuard } from './Auth/AuthGuard';

import { Routes, RouterModule } from '@angular/router';


export const SunmoolAppRoutes = [
  { path: 'home/:category', component: HomeComponent, canActivate : [AuthGuard]},
  { path: 'brandSearch/:term', component: BrandSearchComponent, canActivate : [AuthGuard]},
  { path: 'home/:category/:style', component: HomeComponent, canActivate : [AuthGuard]},
  { path: 'invites', component: InvitesComponent, canActivate : [AuthGuard]},
  { path: 'userProfile/:usrId', component: UserProfileComponent, canActivate : [AuthGuard],
    children: [
      { path: 'items',         component: ProfileItemsComponent },
      { path: 'favorites',     component: ProfileFavoritesComponent },
      { path: 'followers',     component: ProfileFollowersComponent },
      { path: 'following',     component: ProfileFollowingComponent },
      { path: 'brands',        component: ProfileBrandsComponent }
    ]
  },
  { path: 'login', component: LoginComponent},
  { path: 'itemDetails/:id', component: ItemDetailsComponent, canActivate : [AuthGuard]},
  { path: 'messages/:usrId', component: MessagesComponent, canActivate : [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate : [AuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'allNotifications', component: AllNotificationsComponent, canActivate : [AuthGuard]},
      { path: 'profile',  component: ProfileComponent },
      { path: 'editProfile',  component: EditProfileComponent },
      { path: 'notification',  component: NotificationComponent }, 
      { path: 'payment',  component: PaymentComponent },
      { path: 'personalization',  component: PersonalizationComponent },
      { path: 'privacy',  component: PrivacyComponent },
      { path: 'inprocess',  component: InProcessComponent },
      { path: 'inprocess/:transaction',  component: InProcessTransactionComponent },

      { path: 'history',  component: HistoryComponent },

      { path: 'items',     component: ItemsComponent },
      { path: 'myItems',     component: MyItemsComponent },
      { path: 'editItem/:itemId',     component: EditItemComponent },

      { path: 'offers/me',     component: OfferToMeComponent },
      { path: 'offers/others/details/:itemId',     component: ToOthersDetailsComponent },
      { path: 'offers/me/details/:itemId',     component: ToMeDetailsComponent },
      { path: 'offers/others',     component: OfferToOthersComponent },

      { path: 'sunmool/me',     component: SunmoolToMeComponent },
      { path: 'sunmool/me/details/:itemId',     component: SunmoolToMeDetailsComponent },
      { path: 'sunmool/others',     component: SunmoolToOthersComponent },
      { path: 'sunmool/others/details/:itemId',     component: SunmoolToOthersDetailsComponent },

    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
]

export const routing = RouterModule.forRoot(SunmoolAppRoutes);
