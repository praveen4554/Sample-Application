import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../../services/variables';
import { StripeService } from '../../../../../services/payment/StripeService';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../../services/CommonFunctions";

import { Http, Response } from '@angular/http';

import { Headers, RequestOptions } from '@angular/http';

@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/inprocess/singleTransaction/InProcessTransaction.css'],
  templateUrl: './src/app/components/dashboard/pages/inprocess/singleTransaction/InProcessTransaction.html'
})
export class InProcessTransactionComponent {

  public boxStep = false;
  public paymentStep = false;
  public printStep = false;
  public trackStep = false;


  public totalPay = 0;

  public transactionDetails = {};

  public shippingInfo = {};
  public shippingWritten = 0;

  public shippingTransaction = {};

  public boxType;


  public isTaker = false;
  public shippingAdress = {
    shippingAdress : "",
    shippingAdress2 : "",
    shippingCity : "",
    shippingState : "",
    shippingZipcode : ""
  };

  public billingAdress = {
    billingAdress : "",
    billingAdress2 : "",
    billingCity : "",
    billingState : "",
    billingZipcode : ""
  };

  public transactionId;

  public boxTypes = [
    {
        "length": "5",
        "width": "5",
        "height": "5",
        "distance_unit": "in",
        "weight": "0.5",
        "mass_unit": "lb"
    },

    {
        "length": "7",
        "width": "7",
        "height": "7",
        "distance_unit": "in",
        "weight": "3",
        "mass_unit": "lb"
    },

    {
        "length": "9",
        "width": "9",
        "height": "9",
        "distance_unit": "in",
        "weight": "8",
        "mass_unit": "lb"
    }

  ]

  public myBoxComplete = false;
  public myPaymentComplete = false;

  constructor(private http: Http, public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public payment : StripeService, public auth : AuthService, public common : CommonFunctions) {

  }

  makePayment() {
    if(this.totalPay != 0)
    this.payment.openCheckout(this.totalPay*100, token => {
      this.chargePayment(token).subscribe();
    });
  }


  makeLabel (callback) {
    this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid+"/shippingRate").take(1)
    .subscribe(res=> {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this.configVars.apiServerAdress+"/shippoTransaction", {rate : res}, options)
                      .map(res => {
                        var response = JSON.parse(res['_body']);

                        if(response.object_state == "VALID" && response.object_status == "SUCCESS") {
                          this.shippingTransaction = response
                          this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid)
                          .update({shippingTransaction : response}).then(() => {
                            callback();

                           })
                        }

                      }).catch((err, caught) => {

                        alert(JSON.parse(err._body).message)
                        return caught;
                      }).subscribe();
    })
  }
  chargePayment (token) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.configVars.apiServerAdress+"/payment", {stripeToken : token, amount : this.totalPay}, options)
                    .map(res => {
                      res = JSON.parse(res['_body']);
                      if(String(res['status']) == "succeeded") {


                        this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid)
                        .update({paymentDetails : res}).then(() => {

                         })

                        this.changeUserStatus("printStep", () => {

                            this.af.database.object('/inProcess/'+this.transactionId+"/userStatus").take(1)
                            .subscribe(res => {
                              delete res.$key;
                              delete res.$exists;

                              var users = []
                              for(let sts in res) {
                                users.push(res[sts])
                              }

                              if(users[0].status == users[1].status && users[1].status == "printStep") {
                                alert("Thank you for your payment!");
                                this.changeStatus("printStep")
                              }else if(this.transactionDetails['type'] == 'sunmool'){
                                this.changeStatus("printStep")
                              }else{
                                alert("Your payment has been processed. Please wait for the other user to make the payment.")
                                this.myPaymentComplete = true;
                              }



                            })




                        })



                      }else{
                        alert("Sorry, there was a problem. Please try again later.")
                      }

                    }).catch((err, caught) => {
                      alert(JSON.parse(err._body).message)
                      return caught;
                    });
  }

  selectBox (boxType) {
    this.boxType = boxType;
  }

  saveBox () {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    var adressFrom = {};

    adressFrom["object_purpose"] =  "PURCHASE";
    adressFrom["name"] = this.auth.userData.auth.providerData[0].displayName;
    adressFrom["street1"] = this.shippingAdress.shippingAdress;
    adressFrom["city"] = this.shippingAdress.shippingCity;
    adressFrom["state"] = this.shippingAdress.shippingState;
    adressFrom["zip"] = this.shippingAdress.shippingZipcode;
    adressFrom["country"] = "US";
    adressFrom["email"] = this.auth.userData.auth.providerData[0].email;

    this.http.post(this.configVars.apiServerAdress+"/validateAdress",  adressFrom, options)
                    .map(res => {
                      res = JSON.parse(res['_body']);

                      if(res['object_state'] == "VALID") {
                        if(this.transactionDetails['type'] == 'sunmool' && this.isTaker) {
                          this.boxType = "taker"
                        }
                        this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid)
                        .update({boxSize : this.boxType, shippingAdress : this.shippingAdress}).then(() => {

                          this.af.database.object('/inProcess/'+this.transactionId+"/userStatus").take(1)
                          .subscribe(res => {
                            delete res.$key;
                            delete res.$exists;

                            var users = []
                            for(let sts in res) {
                              users.push(res[sts])
                            }
                            if(users.length > 1) {
                              if(users[0].status == users[1].status && users[1].status == "paymentStep") {
                                this.changeStatus("paymentStep")
                              }
                            }else{
                              this.myBoxComplete = true;
                            }
                          })

                        })

                        this.changeUserStatus("paymentStep", ()=>{})
                      }else{
                        alert(res['messages'][0].text)
                      }



                    }).catch((err, caught) => {
                      alert(JSON.parse(err._body).message);

                      return caught;
                    }).subscribe()
  }

  changeUserStatus (status, callback) {
    this.af.database.object('/inProcess/'+this.transactionId+"/userStatus/"+this.auth.userData.uid)
    .update({status : status}).then(res => {
      callback();
    })
  }

  public otherShippingTransaction = {};
  changePageToTracking () {

    this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/")
    .subscribe(res1 => {
      delete res1.$key;
      delete res1.$exists;
      for(var i in res1) {
        if(i == this.auth.userData.uid) {
          this.shippingTransaction = res1[i].shippingTransaction;
        }else{
          this.otherShippingTransaction = res1[i].shippingTransaction;
        }
      }
    })


    this.boxStep = false;
    this.paymentStep = false;
    this.printStep = false;
    this.trackStep = false;

    if(this.transactionDetails['status'] == "printStep") {
      this.trackStep = true;
    }
  }

  changePageToPrint() {
    this.boxStep = false;
    this.paymentStep = false;
    this.printStep = false;
    this.trackStep = false;

    if(this.transactionDetails['status'] == "printStep") {
      this.printStep = true;
    }
  }

  changeStatus(status) {
    this.af.database.object('/inProcess/'+this.transactionId)
    .update({status : status})
  }
  addValues(val1, val2) {
    this.totalPay = parseFloat(val1)+val2
    return this.totalPay;
  }
  getShippingDetails (adressFrom, adressTo) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log("get the details", {adressFrom: adressFrom, adressTo: adressTo, parcel: this.boxTypes[this.boxType]});
    return this.http.post(this.configVars.apiServerAdress+"/shippment", {adressFrom: adressFrom, adressTo: adressTo, parcel: this.boxTypes[this.boxType]}, options)
                    .map(res => {
                      if(res['_body']) {
                        this.shippingInfo = JSON.parse(res['_body']);
                        this.shippingInfo
                        this.shippingInfo["rates_list"].sort(function(a,b) {return (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0);} );
                        var min = 100000;
                        var minObj = {};
                        console.log('rates are: ', this.shippingInfo["rates_list"])
                        for(var i=0; i < this.shippingInfo["rates_list"].length; i++) {
                          if(this.shippingInfo["rates_list"][i].amount < min && this.shippingInfo["rates_list"][i].servicelevel_name != 'Priority Mail Express') {
                            minObj = this.shippingInfo["rates_list"][i]
                            min = this.shippingInfo["rates_list"][i].amount;
                          }
                        }
                        this.shippingInfo["rates_list"] = [minObj]
                        return this.shippingInfo;

                      }

                    })


  }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.transactionId=params['transaction'];


      this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid+'/shippingAdress')
      .subscribe(res => {
        if(res.$exists()) {
          this.shippingAdress.shippingAdress = res.shippingAdress
          this.shippingAdress.shippingAdress2 = res.shippingAdress2
          this.shippingAdress.shippingCity = res.shippingCity
          this.shippingAdress.shippingState = res.shippingState
          this.shippingAdress.shippingZipcode = res.shippingZipcode
        }

        this.af.database.object('/billing/'+this.auth.userData.uid)
        .subscribe (res1 => {
          if(!res.$exists()) {
            this.shippingAdress.shippingAdress = res1.shippingAdress
            this.shippingAdress.shippingAdress2 = res1.shippingAdress2
            this.shippingAdress.shippingCity = res1.shippingCity
            this.shippingAdress.shippingState = res1.shippingState
            this.shippingAdress.shippingZipcode = res1.shippingZipcode
          }
        })


        this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid+'/billingAdress')
        .subscribe(res => {
          if(res.$exists()) {
            this.billingAdress.billingAdress = res.billingAdress
            this.billingAdress.billingAdress2 = res.billingAdress2
            this.billingAdress.billingCity = res.billingCity
            this.billingAdress.billingState = res.billingState
            this.billingAdress.billingZipcode = res.billingZipcode
          }

          this.af.database.object('/billing/'+this.auth.userData.uid)
          .subscribe (res1 => {
            if(!res.$exists()) {
              this.billingAdress.billingAdress = res1.billingAdress
              this.billingAdress.billingAdress2 = res1.billingAdress2
              this.billingAdress.billingCity = res1.billingCity
              this.billingAdress.billingState = res1.billingState
              this.billingAdress.billingZipcode = res1.billingZipcode
            }
          })



        })



      })




      this.af.database.object('/inProcess/'+params['transaction'])

      .subscribe ( transaction => {


        this.boxStep = false;
        this.paymentStep = false;
        this.printStep = false;
        this.trackStep = false;

        if(transaction.offerFrom == this.auth.userData.uid) {
          this.isTaker = true;
        }




        if(!transaction.status) {

          this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid+"/boxSize").take(1)
          .subscribe(res => {
            if(res.$exists()) {
              this.myBoxComplete = true;
            }
          })

          transaction.status = "boxStep";
          this.boxStep = true;


        }else{
          switch(transaction.status) {
            case "boxStep" :
            this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid+"/boxSize").take(1)
            .subscribe(res => {
              if(res.$exists()) {
                this.myBoxComplete = true;
              }
            })

              this.boxStep = true;
            break;

            case "paymentStep" :
              this.paymentStep = true;
              this.af.database.object('/inProcess/'+this.transactionId+"/userStatus/"+this.auth.userData.uid+"/status")
              .subscribe (pres => {
                if(pres.$exists() && pres.$value == "printStep") {
                  this.myPaymentComplete = true;
                }else{
                  if(transaction.type == "sunmool" && !this.isTaker) {
                    this.myPaymentComplete = true;
                    this.changeUserStatus("printStep", () => {})
                  }

                  var me = "";
                  var other = "";
                  this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/").take(1)
                  .subscribe(res => {
                    delete res.$key;
                    delete res.$exists;

                    for(let sts in res) {
                      if(sts == this.auth.userData.uid)
                      {
                        me = sts;
                      }else{
                        other = sts;
                      }
                    }

                    var adressFrom = {};

                    adressFrom["object_purpose"] =  "PURCHASE";
                    adressFrom["name"] = this.auth.userData.auth.providerData[0].displayName;
                    adressFrom["street1"] =res[me].shippingAdress.shippingAdress;
                    adressFrom["city"] =res[me].shippingAdress.shippingCity;
                    adressFrom["state"] =res[me].shippingAdress.shippingState;
                    adressFrom["zip"] =res[me].shippingAdress.shippingZipcode;
                    adressFrom["country"] = "US";
                    adressFrom["email"] = this.auth.userData.auth.providerData[0].email;




                    this.af.database.object('/users/'+other).take(1)
                    .subscribe (otherUser => {

                      var adressTo = {};


                      adressTo["object_purpose"] =  "PURCHASE";
                      adressTo["name"] = otherUser.displayName
                      adressTo["street1"] =res[other].shippingAdress.shippingAdress;
                      adressTo["city"] =res[other].shippingAdress.shippingCity;
                      adressTo["state"] =res[other].shippingAdress.shippingState;
                      adressTo["zip"] =res[other].shippingAdress.shippingZipcode;
                      adressTo["country"] = "US";
                      adressTo["email"] = otherUser.email;

                      if(transaction.type == "sunmool" && this.isTaker) {
                        this.boxType = res[other].boxSize;
                      }else{
                        this.boxType = res[me].boxSize;
                      }



                      this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid+"/shippingRate")
                      .subscribe(res => {
                        if(res.$exists() && res.object_state == "VALID") {
                          this.shippingInfo["rates_list"] = [res]
                        }else{
                          if(transaction.type == "sunmool" && this.isTaker) {
                            this.getShippingDetails(adressTo, adressFrom).subscribe(res => {
                              this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid)
                              .update({shippingRate : res['rates_list'][0]})
                            })
                          }else{
                            this.getShippingDetails(adressFrom, adressTo).subscribe(res => {
                              this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid)
                              .update({shippingRate : res['rates_list'][0]})
                            })
                          }

                        }
                      })
                    })
                  })
                }

              })






            break;

            case "printStep" :

            console.log("print step triggered!!!!")
            this.af.database.object('/transactionOptions/'+this.transactionId+"/userTransactionOptions/"+this.auth.userData.uid+"/shippingTransaction")
            .subscribe(res => {

              if(res.$exists() && res.object_state == "VALID" && res.object_status == "SUCCESS") {
                this.shippingTransaction = res;
                if(transaction.type == "sunmool")
                  this.changePageToTracking();
                console.log("aici1")
              }else{
                if(transaction.type != "sunmool") {
                  this.makeLabel (() => {})
                  console.log("aici2")
                }else if(transaction.type == "sunmool" && this.isTaker) {

                  this.changePageToTracking();
                  this.makeLabel (() => {})
                  console.log("aici3")
                }else if(transaction.type == "sunmool" && !this.isTaker) {
                  this.changePageToTracking();
                  this.changePageToPrint();
                  console.log("aici4")
                }

              }
            })

              this.printStep = true;
            break;

            case "trackStep" :
              this.trackStep = true;
            break;
          }
        }

        if(transaction.type == "sunmool" ) {
          transaction.mainItem = transaction.item;
        }
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


        if(transaction.type != "sunmool" ) {
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



        this.transactionDetails = transaction;
      })


    })
  }

}
