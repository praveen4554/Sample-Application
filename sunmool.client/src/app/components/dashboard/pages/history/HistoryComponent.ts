import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
    selector: 'history-cmpnt',
    styleUrls: ['./src/app/components/dashboard/pages/history/History.css'],
    templateUrl: './src/app/components/dashboard/pages/history/History.html',
})
export class HistoryComponent {



    constructor(public router:Router) {

    }

}
