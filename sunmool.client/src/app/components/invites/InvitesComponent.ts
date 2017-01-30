import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'invites-cmpnt',
  styleUrls: ['./src/app/components/invites/Invites.css'],
  templateUrl: './src/app/components/invites/Invites.html',
})
export class InvitesComponent {



  constructor(public router:Router) {

  }

}
