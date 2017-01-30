import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import {AuthService} from "../../../../services/Auth/AuthService";
import { VariableService } from '../../../../services/variables';
import {CommonFunctions} from "../../../../services/CommonFunctions";

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/inprocess/InProcess.css'],
  templateUrl: './src/app/components/dashboard/pages/inprocess/InProcess.html',
})
export class InProcessComponent {


  goToProcess(itemId) {

    this.router.navigate(['/dashboard/inprocess/'+itemId]);
    return false;
  }


  public allTransactions = [];
  constructor(public router:Router, public af: AngularFire, public auth: AuthService, public configVars : VariableService, public common : CommonFunctions) {
    this.af.database.list('/myInProcess/'+this.auth.userData.uid)
    .map(process => {
      this.allTransactions = [];
      for (let transactionId of process) {

                console.log("get: ", transactionId);
                //----
                this.af.database.object('/inProcess/'+transactionId.processId)

                .subscribe ( transaction => {
                  console.log(transaction);

                  transaction.mainItem = transaction.item;

                  this.af.database.object(`/items/${transaction.mainItem}`).subscribe(mainItem => {
                    transaction.mainItemDetails = mainItem;
                  });

                  this.af.database.object(`/users/${transaction.offerTo}`).subscribe(user => {
                    transaction.offerToDetails = user;
                  });

                  this.af.database.object(`/users/${transaction.offerFrom}`).subscribe(user => {
                    transaction.offerFromDetails = user;
                  });

                  this.af.database.object(`/likes/${transaction.mainItem}`).subscribe(likes => {
                    transaction.likes = likes;
                  });


                  var queryList = this.af.database.list('/comments/'+transaction.mainItem).subscribe(res => {
                    transaction.comments = res;
                  });


                  if(transaction.type != 'sunmool') {
                    var countToOffer = 0;
                    var counterToGet = 0;

                    var offersPhotos = [];
                    var getPhotos = [];

                      for(let item of transaction.itemsToOffer)
                      {
                        this.af.database.object('/items/'+item).subscribe(res => {

                          if(!transaction.itemsToOfferDetails)
                            transaction.itemsToOfferDetails = [];

                            countToOffer++;
                            if(res.photos) {
                              offersPhotos.push(res);
                            }
                            if(countToOffer == transaction.itemsToOffer.length) {
                              countToOffer = 0;
                              transaction.offerPhotos = this.common.makeGroupOfItems(offersPhotos, 2);
                              offersPhotos = [];
                            }
                            transaction.itemsToOfferDetails.push(res)
                          });


                      }


                      for(let item of transaction.itemsToGet)
                      {
                        this.af.database.object('/items/'+item).subscribe(res => {
                          if(!transaction.itemsToGetDetails)
                            transaction.itemsToGetDetails = [];

                            counterToGet++;
                            if(res.photos) {
                              getPhotos.push(res);
                            }
                            if(counterToGet == transaction.itemsToGet.length) {
                              counterToGet = 0;
                              transaction.getPhotos = this.common.makeGroupOfItems(getPhotos, 2);
                              getPhotos = [];
                            }

                            transaction.itemsToGetDetails.push(res)
                        });


                      }

                  }


                  this.allTransactions.push(transaction);

                })

                //----

      }

      return this.allTransactions;
    })
    .subscribe(res=> {
      console.log("my in process are: ",res);
     })
  }

}
