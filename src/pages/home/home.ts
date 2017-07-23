import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  currentMonthYear: string;

  constructor(public navCtrl: NavController) {
    this.goCurrentMonth();
  }

  goCurrentMonth() {
    let now = moment();
    this.currentMonthYear = now.format('MMMM YYYY');
  }

}
