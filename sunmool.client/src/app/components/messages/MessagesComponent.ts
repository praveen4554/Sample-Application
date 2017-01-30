import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../services/Auth/AuthService";
import {CommonFunctions} from "../../services/CommonFunctions";

import { FileUploader} from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'msgs-cmpnt',
  styleUrls: ['./src/app/components/messages/Messages.css'],
  templateUrl: './src/app/components/messages/Messages.html',
})
export class MessagesComponent {

  public userId = "";
  public users = [];
  public chatKey;
  public messageToSend ="";
  public opened;

  public mesegeListener ={};
  public myMessageListener ={};

  public uploader:FileUploader;

  public uploadedPhoto = "";


  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  public messages = [];
  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {

    this.uploader = new FileUploader({url: configVars.apiServerAdress+"/api", autoUpload : true});


    this.uploader.onCompleteItem = (item, response, status, header) => {
      if (status === 200) {
        this.uploadedPhoto = configVars.apiServerAdress+"/uploads/" + JSON.parse(response).filename;
      }
    }

  }



  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }


  sendMessage (event) {
    if((event && event.code != "Enter") || this.messageToSend == "")
    {
      return;
    }
    var itemsToDisplay = [];
    if(this.messageToSend.indexOf("/#/itemDetails") != -1) {
      var regex=/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
      var result= this.messageToSend.match(regex);
      for(var x=0; x < result.length; x++) {
        if(result[x].indexOf("/#/itemDetails") != -1)
        {
          this.messageToSend.replace(result[x], "");
          var urlItemId = result[x].split("/");
          itemsToDisplay.push(urlItemId[urlItemId.length-1]);
        }

      }

    }

    if(this.messageToSend != "") {
      var objToSend = {message : this.messageToSend, uid : this.auth.userData.uid, timestamp : Math.floor((new Date()).getTime() / 1000), type : "simpleMessage" };
      if(this.uploadedPhoto != '')
      {
        objToSend['photo'] = this.uploadedPhoto;
        this.uploadedPhoto = "";
      }
      this.af.database.list('/chats/'+this.chatKey+"/messages").push(objToSend);
      this.af.database.object('/myMessages/'+this.userId+"/"+this.auth.userData.uid).update({noMessages : false, newMessages : true});
      this.messageToSend = "";
    }


    for(var i=0; i < itemsToDisplay.length; i++) {
      this.af.database.list('/chats/'+this.chatKey+"/messages").push({itemId:itemsToDisplay[i], uid : this.auth.userData.uid, timestamp : Math.floor((new Date()).getTime() / 1000), type : "itemDetail"});
      this.af.database.object('/myMessages/'+this.userId+"/"+this.auth.userData.uid).update({noMessages : false, newMessages : true});
    }
    return false;
  }
  ngOnDestroy() {
    if(this.mesegeListener[this.userId]) {
      this.mesegeListener[this.userId].unsubscribe();
      delete this.mesegeListener[this.userId];
    }

    if(this.myMessageListener[this.userId]) {
      this.myMessageListener[this.userId].unsubscribe();
      delete this.myMessageListener[this.userId];
    }

  }

  removeListeners(usrId) {
    if(this.mesegeListener[this.userId]) {
      this.mesegeListener[this.userId].unsubscribe();
      delete this.mesegeListener[this.userId];
    }

    if(this.myMessageListener[this.userId]) {
      this.myMessageListener[this.userId].unsubscribe();
      delete this.myMessageListener[this.userId]
    }
    this.router.navigate(['/messages/'+usrId]);

    return false;
  }
  subscribeToMessages () {
    if(!this.chatKey)
      return;

    this.mesegeListener[this.userId] = this.af.database.list('/chats/'+this.chatKey+"/messages", {
      query : {
        orderByChild: 'timestamp',
        limitToLast: 100
      }

    })
    .map(items => {
      var count = 0;
      for (let item of items) {
        // Find each corresponding associated object and store it as a FibreaseObjectObservable
        this.af.database.object(`/users/${item.uid}`).subscribe(user => {
          if(count == 0 && this.userId == user.$key) {

            this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+user.$key).update({newMessages : false});
            count++;
          }
          item.user = user;
        });

        if(item.type == "itemDetail") {
          this.af.database.object(`/items/${item.itemId}`).subscribe(itemD => {
            itemD.photoCarousel = this.common.makeGroupOfItems(itemD.photos, 3);
            item.itemDetails = itemD;
          });
        }
      }

      return items;
    })
    .subscribe(messages => {
      this.messages = messages;
      setTimeout(() =>{
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }, 300)

     });
  }

  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.route.params.subscribe(params => {
        if (params['usrId'] && params['usrId'] != 'all' && this.auth.userData != null) {
          this.userId = params["usrId"];


          //initialize new chat if does not exist
          this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+this.userId).take(1).subscribe(userChat => {
              if(!userChat.$exists()) {
                this.chatKey = this.guid();
                this.subscribeToMessages()
                this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+this.userId).set({newMessages : false, noMessages : false, chatKey : this.chatKey, timestamp : Math.floor((new Date()).getTime() / 1000) }).then(res =>{

                  this.af.database.object('/chats/'+this.chatKey+"/users").set({user1 : this.auth.userData.uid, user2 : this.userId}).then(() => {
                    this.af.database.object('/myMessages/'+this.userId+"/"+this.auth.userData.uid ).set({newMessages : false, noMessages : true, chatKey : this.chatKey, timestamp : Math.floor((new Date()).getTime() / 1000) }).then(res =>{

                    })
                  });
                })
              }else{
                this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+this.userId).update({timestamp : Math.floor((new Date()).getTime() / 1000)});
                this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+this.userId).update({noMessages : false, newMessages : false});
                this.af.database.object('/myMessages/'+this.auth.userData.uid +"/"+this.userId).take(1).subscribe(mymesg => {
                  this.chatKey = mymesg.chatKey;
                  this.subscribeToMessages()
                })
              }
           });
        }

        var self = this;

        //get the users list that are already in my chat
      this.myMessageListener[this.userId] = this.af.database.list('/myMessages/'+this.auth.userData.uid, {
          query : {
            orderByChild: 'timestamp',
            limitToLast: 100
          }

        })
        .map(items => {
          for (let item of items) {
            // Find each corresponding associated object and store it as a FibreaseObjectObservable
            this.af.database.object(`/users/${item.$key}`).subscribe(user => {
              item.user = user;
            });
          }

          return items.reverse();
        })
        .subscribe(users => {
          if(params['usrId'] && params['usrId'] == "all" && users.length > 0 && users[0].noMessages != true) {
            //this.router.navigate(['/messages/'+users[0].$key]);
          }
          this.users = users;
         });

      });
  }

}
