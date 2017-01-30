import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/privacy/Privacy.css'],
  templateUrl: './src/app/components/dashboard/pages/privacy/Privacy.html',
})
export class PrivacyComponent {



  constructor(public router:Router) {

  }

}
