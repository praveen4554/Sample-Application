import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../services/CommonFunctions";

@Component({
  selector: 'profbrnd-cmpnt',
  styleUrls: ['./src/app/components/userProfile/pages/brands/ProfileBrands.css'],
  templateUrl: './src/app/components/userProfile/pages/brands/ProfileBrands.html',
})
export class ProfileBrandsComponent {

  public userId = "";

  public brandsList = [];


  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {



  }


  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.route.parent
      .params.subscribe(params => {
        if (params['usrId'] && this.auth.userData != null) {
          this.userId = params["usrId"];




          this.af.database.list('followingBrand/'+this.userId, {
            query: {
              orderByChild: 'following',
              equalTo: true
            }
          })
          .map(res => {

            for(let i of res) {
              this.af.database.object('brands/'+i.$key)
              .subscribe(res1 => {
                i.brandData = res1;
              })
            }

            return res;
          })
          .subscribe(res => {
            console.log("following:", res )
            this.brandsList = res;
          })





        }
      });
  }

  searchBrand(term, event) {
    if((event && event.code != "Enter"))
    {
      return;
    }

    console.log(term)

    this.router.navigate(['/brandSearch', term])
  }

}
