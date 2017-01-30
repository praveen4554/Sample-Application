import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/profile/Profile.css'],
  templateUrl: './src/app/components/dashboard/pages/profile/Profile.html',
})
export class ProfileComponent {



  constructor(public router:Router) {

  }

}
