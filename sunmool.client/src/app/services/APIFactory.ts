import { Headers, RequestOptions,Http } from '@angular/http';
export class APIFactory{



  constructor(private options, public http : Http) {
  }

  fetch () {
    return this.http.get(this.options.API_URL)
                    .map(function (res){
                      /*if(res.json.success == false){
                        alert(this.options.errorMessage)
                      }*/
                      return res.json();
                    })
  }



  put (data) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.options.API_URL, JSON.stringify(data), options)
                    .map(res => {

                      if(res.json().success) {

                        alert(this.options.successMessage);
                      }else{
                        alert(this.options.errorMessage)
                      }

                      return res.json();
                    })
                    // .subscribe(function(res){

                    //
                    // });
  }

  update (data) {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this.options.API_URL, JSON.stringify(data), options)
                    .map(res => {

                      if(res.json().success) {

                        alert(this.options.successMessage);
                      }else{
                        alert(this.options.errorMessage)
                      }

                      return res.json();
                    })
                    // .subscribe(function(res){

                    //
                    // });
  }


}
