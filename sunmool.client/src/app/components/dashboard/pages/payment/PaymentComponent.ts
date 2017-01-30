import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import {AuthService} from "../../../../services/Auth/AuthService";
import { VariableService } from '../../../../services/variables';
import {CommonFunctions} from "../../../../services/CommonFunctions";
@Component({
  selector: 'profile-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/payment/Payment.css'],
  templateUrl: './src/app/components/dashboard/pages/payment/Payment.html',
})
export class PaymentComponent {

  public fullName = "";
  public cardNumber = "";
  public securityCode = "";
  public cardMonth = "Month";
  public cardYear = "Year";

  public billingAdress = "";
  public billingAdress2 = "";
  public billingCity = "";
  public billingState = "";
  public billingZipcode = "";

  public shippingAdress = "";
  public shippingAdress2 = "";
  public shippingCity = "";
  public shippingState = "";
  public shippingZipcode = "";



  public months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public years = [];

  constructor(public router:Router, public af: AngularFire, public auth: AuthService, public configVars : VariableService, public common : CommonFunctions) {

    var startYear = 1916;
    for(var i=1; i<=100; i++) {
      this.years.push(startYear);
      startYear++;
    }


    this.af.database.object("billing/"+this.auth.userData.uid).take(1).subscribe(data => {

        this.fullName = data.fullName
        this.cardNumber = data.cardNumber
        this.securityCode = data.securityCode
        this.billingAdress = data.billingAdress
        this.billingAdress2 = data.billingAdress2
        this.billingCity = data.billingCity
        this.billingState = data.billingState
        this.billingZipcode = data.billingZipcode
        this.shippingAdress = data.shippingAdress
        this.shippingAdress2 = data.shippingAdress2
        this.shippingCity = data.shippingCity
        this.shippingState = data.shippingState
        this.shippingZipcode = data.shippingZipcode
        if(data.cardMonth)
          this.cardMonth = data.cardMonth
        if(data.cardYear)
          this.cardYear = data.cardYear

     });
  }

  changeMonth (month) {
    this.cardMonth = month;
  }

  changeYear (year) {
    this.cardYear = year;
  }
  sameAsBilling() {
    this.shippingAdress = this.billingAdress || "";
    this.shippingAdress2 = this.billingAdress2 || "";
    this.shippingCity = this.billingCity || "";
    this.shippingState = this.billingState || "";
    this.shippingZipcode = this.billingZipcode || "";

    return false;
  }
  saveBilling() {
    var item = {
      billingAdress : this.billingAdress || "",
      billingAdress2 : this.billingAdress2 || "",
      billingCity : this.billingCity || "",
      billingState : this.billingState || "",
      billingZipcode : this.billingZipcode || "",
      shippingAdress : this.shippingAdress || "",
      shippingAdress2 : this.shippingAdress2 || "",
      shippingCity : this.shippingCity || "",
      shippingState : this.shippingState || "",
      shippingZipcode : this.shippingZipcode || ""
    }

    this.af.database.object("billing/"+this.auth.userData.uid).update(item).then((_data) => {
          alert("Yor information has been saved!")
        })
  }

}
