import { Component } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { AngularFire, FIREBASE_PROVIDERS} from 'angularfire2';
import { VariableService } from '../../../../services/variables';
import 'rxjs/add/operator/take'
import {AuthService} from "../../../../services/Auth/AuthService";
import {CommonFunctions} from "../../../../services/CommonFunctions";
import { FileUploader} from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'items-cmpnt',
  styleUrls: ['./src/app/components/dashboard/pages/editItem/EditItem.css'],
  templateUrl: './src/app/components/dashboard/pages/editItem/EditItem.html'
  //directives: [FILE_UPLOAD_DIRECTIVES]
})
export class EditItemComponent {
  public uploader:FileUploader;
  public item = {
    category : "",
    size : "",
    uid : "",
    photos: [],
    style : "",
    colors : ""
  };

  public itemsCollection;


  public photosArray = [];
  public photoCarousel = [];

  public itemId = '';

  public stylesOptions = [];

  public conditionList = [];
  public colorsList = [];

  constructor(public af : AngularFire, public router:Router, public route: ActivatedRoute, public configVars : VariableService, public auth : AuthService, public common : CommonFunctions) {
    this.uploader = new FileUploader({url: configVars.apiServerAdress+"/api", autoUpload : true});

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


  changeCondition(condition) {
    this.item['condition'] = condition;
    return false;
  }

  ngOnInit() {


  this.route.params.subscribe(params => {


    this.itemId = params['itemId'];
    //get current selected user items
    this.af.database.object('/items/'+params['itemId'])
    .subscribe(myItem => {
      this.item = myItem;
      this.photosArray = myItem.photos;
      this.makeCaruselArray();
     });





  })

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
      if(this.item.uid != this.auth.userData.uid)
        return;
    this.uploader.clearQueue();

    this.item.uid = this.auth.userData.uid;
    if(this.photosArray.length >0)
      this.item.photos = this.photosArray;
      delete this.item['$key'];
      delete this.item['$exists'];
    this.af.database.object('/items/'+this.itemId).set(this.item).then((_data) => {
            this.item = {
              category : "",
              size : "",
              uid : "",
              photos: [],
              style : "",
              colors : ""
            };
            this.router.navigate(['/itemDetails/'+this.itemId]);
            this.photoCarousel = [];
            this.photosArray = [];
        }).catch((_error) => {
            console.log(_error)
        })
  }
}
