import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import {AuthService} from "../../../../services/Auth/AuthService";
import { VariableService } from '../../../../services/variables';
import {CommonFunctions} from "../../../../services/CommonFunctions";

import { FileUploader} from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'items-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/items/Items.css'],
  templateUrl: './src/app/components/dashboard/pages/items/Items.html'
  //directives: [FILE_UPLOAD_DIRECTIVES]
})
export class ItemsComponent {
  public uploader:FileUploader;
  public item = {
    category : "",
    size : "",
    uid : "",
    photos: [],
    style : "",
    colors : ""
  };

  public stylesOptions = [];

  public itemsCollection;


  public photosArray = [];
  public photoCarousel = [];

  public conditionList = [];
  public colorsList = [];


  constructor(public router:Router, public af: AngularFire, public auth: AuthService, public configVars : VariableService, public common : CommonFunctions) {
    this.uploader = new FileUploader({url: configVars.apiServerAdress+"/api", autoUpload : true});
   
  console.log("working");
    this.af.database.list("/staticData/condition")
    .subscribe(res => {
      this.conditionList = res;
    })

    this.af.database.list("/staticData/colors")

    .subscribe(res => {
      this.colorsList = res;
    })


    this.itemsCollection = af.database.list("items");

    this.uploader.onCompleteItem = (item, response, status, header) => {
      if (status === 200) {
        this.photosArray.push(JSON.parse(response).filename);
      }
    }


    this.uploader.onCompleteAll = () => {
      this.makeCaruselArray();
    }

  }

  makeCaruselArray() {
    var count = 1;
    var arrCount = 0;
    this.photoCarousel = [];
    for(var i=0; i < this.photosArray.length; i++) {


      if(!this.photoCarousel[arrCount]) {
        this.photoCarousel[arrCount] = new Array();
      }


      if(count > 4) {
        count = 1;
        arrCount++

        if(!this.photoCarousel[arrCount]) {
          this.photoCarousel[arrCount] = new Array();
        }

        this.photoCarousel[arrCount].push(this.photosArray[i])
      }else{
        this.photoCarousel[arrCount].push(this.photosArray[i])
        count++;
      }
    }
  }

  changeCategory(categ) {
    this.stylesOptions = this.common.subcategories[categ];
    this.item.style = "";
    this.item.category = categ;

    return false;
  }

  changeSize(size) {
    this.item.size = size;

    return false;
  }

  changeColor(color) {
    this.item.colors = color;
    return false;
  }

  changeCondition(condition) {
    this.item['condition'] = condition;
    return false;
  }

  changeStyle(style) {
    this.item.style = style;

    return false;
  }


  removeItemPhoto(photo) {
    for(var i = 0; i < this.photosArray.length; i++) {
        if(this.photosArray[i] == photo) {
            this.photosArray.splice(i, 1);
            break;
        }
    }

    this.makeCaruselArray();
  }

  saveItem() {

    this.uploader.clearQueue();

    this.item.uid = this.auth.userData.uid;
    if(this.photosArray.length >0)
      this.item.photos = this.photosArray;
    this.itemsCollection.push(this.item).then((_data) => {
            this.item = {
              category : "",
              size : "",
              uid : "",
              photos: [],
              style : "",
              colors : ""
            };
            this.router.navigate(['/itemDetails/'+_data.key]);
            this.photoCarousel = [];
            this.photosArray = [];
        }).catch((_error) => {
            console.log(_error)
        })
  }
}
