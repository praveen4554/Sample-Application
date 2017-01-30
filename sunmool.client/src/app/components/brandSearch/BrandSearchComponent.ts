import { Component, Output, EventEmitter } from '@angular/core';
import {  Router, NavigationStart, ActivatedRoute} from '@angular/router';
import { AuthService } from '../../services/Auth/AuthService';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { Events}    from '../../services/Auth/Events';
import {CommonFunctions} from "../../services/CommonFunctions";


import { VariableService } from '../../services/variables';

import { FileUploader} from 'ng2-file-upload/ng2-file-upload';


@Component({
  selector: 'brandSearch-cmpnt',
  styleUrls: ['./src/app/components/brandSearch/BrandSearch.css'],
  templateUrl: './src/app/components/brandSearch/BrandSearch.html',
})
export class BrandSearchComponent {

  public searchTerm = "";

  public brandsList = [];

  public searchStarted = false;

  public addState = false;

  public brandPhoto = "";

  public brandUploader:FileUploader;

  constructor(private auth : AuthService, public af: AngularFire, public configVars : VariableService, private eventEmitter : Events, public router : Router, public route: ActivatedRoute, public common : CommonFunctions) {


    this.brandUploader = new FileUploader({url: configVars.apiServerAdress+"/api", autoUpload : true});

    this.brandUploader.onCompleteItem = (item, response, status, header) => {
      if (status === 200) {
        this.brandPhoto = this.configVars.apiServerAdress+"/uploads/"+ JSON.parse(response).filename;
      }
    }
  }

  ngOnInit() {
    // Get parent ActivatedRoute of this route.
    this.route
      .params.subscribe(params => {
        if (params['term']) {
          this.searchTerm = params["term"];

          this.searchStarted = true;
          this.getSimilarItems();
        }
      });
  }

  searchBrand(term, event) {
    if((event && event.code != "Enter"))
    {
      this.addState = false;
      this.searchStarted = true;
      return;
    }


    this.router.navigate(['/brandSearch', term])
  }


  addBrand() {
     this.af.database.list("brands/").push({name : this.searchTerm, logo : this.brandPhoto})
    .then(res => {
      //this.searchBrand(this.searchTerm, null);
      this.addState = false;
      this.searchStarted = true;
      this.searchTerm = ''
      alert("Brand Added!")
    })
    .catch(err => {
      alert("Error, please try later.")
    })
  }

  getSimilarItems () {
      var query = {
          "query": {
            "term" : {
                  "name" : this.searchTerm
            }
          }
        }

        var request = this.af.database.list('/search/request').push({ index: 'firebase', type: 'brand', query: query });

        var response = this.af.database.object('/search/response/'+request.key)
        .map( result => {



          if(result.total && result.total != 0 && result.hits.length > 0) {
            for(var i=0; i < result.hits.length; i++) {
              if(result.hits[i] && result.hits[i]._source) {
                result.hits[i]._source.$key = result.hits[i]._id
                if(result.hits)
                this.af.database.object("followingBrand/"+this.auth.userData.uid+"/"+result.hits[i]._source.$key)
                .subscribe(res1 => {
                  result.hits[0]._source.followData = res1;
                })
              }

            }

          }else if(result.total == 0){
          }

          return result;
        })
        .subscribe(result => {
          this.brandsList = [];
         if(result.total && result.total != 0 && result.hits.length > 0) {

           for(var i=0; i < result.hits.length; i++) {

             this.brandsList.push(result.hits[i]._source);
           }
           if(response) {
             response.unsubscribe();
           }
           console.log("result success", this.brandsList)
         }else if(result.total == 0){
           console.log("result failed", this.brandsList)
           if(response) {
             response.unsubscribe();
           }
         }

         this.searchStarted = false;



        });
  }

}
