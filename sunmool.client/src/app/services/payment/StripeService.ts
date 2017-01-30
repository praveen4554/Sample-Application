
import { Injectable, EventEmitter }             from '@angular/core';
//import * as io from "socket.io-client"
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';



@Injectable()
export class StripeService {

  constructor (private http: Http) {

  }

  openCheckout (amount, callback) {
    var handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_anDjvm3tkxEkfE6ypUVCrWHs',
      locale: 'auto',
      token: function(token: any) {
        callback(token)
      }
    });

    handler.open({
      name: 'Sunmool payment',
      description: 'Shippment and transaction fee',
      currency: "USD",
      amount: amount
    })
  }


}

export const STRIPE_SERVICE_PROVIDER = [
  StripeService
];
