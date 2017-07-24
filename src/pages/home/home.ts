import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  currentMonthYear: string;
  gridPosition: object = {};
  dayContent: object = {};

  constructor(public navCtrl: NavController) {
    this.goMonth(moment().format('MM'), moment().format('YYYY'));
  }

  goMonth(month: string, year: string) {
    let x: number;
    let y: number;
    let currentDay: number = 1;
    this.currentMonthYear = moment(month, 'MM').format('MMMM') + " " + year;
    let daysInMonth = moment(year + "-" + month, "YYYY-MM").daysInMonth();
    let firstDayOfMonth = moment(year + "-" + month + "-01", "YYYY-MM-DD").format('d');

    for (x = 0; x < 7; x++) {
      this.gridPosition[x] = {};
      this.dayContent[x] = {};
      for (y = 0; y < 7; y++) {
        this.gridPosition[x][y] = "";
        this.dayContent[x][y] = [];
      }
    }

    x = Number(firstDayOfMonth);
    y = 0;

    while (currentDay <= daysInMonth) {
      // Set day of the month
      this.gridPosition[x][y] = currentDay;
      // Set day content
      // ???
      currentDay += 1;
      x = ((x + 1) % 7);
      if (x == 0) {
        y += 1;
      }
    }

    this.dayContent[6][0] = [{content: "Some", color: "danger"}];
    this.dayContent[4][2] = [{content: "Wow", color: "primary"}, {content: "Dance", color: "secondary"}];
  }

}
