import { Component } from '@angular/core';
import { NavController, AlertController, FabContainer } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import * as moment from 'moment';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})

export class CalendarPage {
  selectedMonth: any;
  currentMonthYearDisplay: string;
  gridPosition: object = {};
  dayContent: object = {};
  monthDayPosition: object = {};
  fbCalendarCategories: FirebaseListObservable<any>;
  allCalendarCategories: object = {};
  monthEvents: Object[] = [];
  queryCriteria = new Subject();

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public af: AngularFireDatabase) {
    this.selectedMonth = moment().startOf('month');;
    this.fbCalendarCategories = af.list('/calendarcategories');
    this.af.list('/calendarcategories').subscribe(aCalendarCategories => {
      this.allCalendarCategories = [];
      aCalendarCategories.forEach(calendarCategory => {
        this.allCalendarCategories[calendarCategory.$key] = calendarCategory.color;
      });
    });

    this.af.list('/calendarevents', {
      query: {
        orderByChild: 'yearMonth',
        equalTo: this.queryCriteria
      }
    }).subscribe(queriedItems => {
      this.monthEvents = queriedItems;
console.log("Month Events (" + this.selectedMonth.format('YYYY') + this.selectedMonth.format('MM') + ") :");
console.log(this.monthEvents);
      // use this.monthDayPosition[day of the month] to get the x, y coordinates to populate in this.dayContent[x][y]
      this.dayContent[6][0] = [{content: "Some", color: "danger"}];
      this.dayContent[4][2] = [{content: "Wow", color: "primary"}, {content: "Dance", color: "secondary"}];
    });

    this.goMonth(this.selectedMonth.format('MM'), this.selectedMonth.format('YYYY'));
  }

  goMonth(month: string, year: string) {
    let x: number;
    let y: number;
    let currentDay: number = 1;
    this.currentMonthYearDisplay = moment(month, 'MM').format('MMMM') + " " + year;
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
      this.gridPosition[x][y] = currentDay;
      this.monthDayPosition[currentDay] = {x: x, y: y};
      currentDay += 1;
      x = ((x + 1) % 7);
      if (x == 0) {
        y += 1;
      }
    }

    this.getMonthEvents(month, year);
  }

  getMonthEvents(month: string, year: string) {
    this.queryCriteria.next(year + month);
  }

  goNextMonth() {
    this.selectedMonth = moment(this.selectedMonth).add(1, 'month');
    this.goMonth(this.selectedMonth.format('MM'), this.selectedMonth.format('YYYY'));
  }

  goPreviousMonth() {
    this.selectedMonth = moment(this.selectedMonth).subtract(1, 'month');
    this.goMonth(this.selectedMonth.format('MM'), this.selectedMonth.format('YYYY'));
  }

  addEvent(fab: FabContainer) {
    fab.close();
    let prompt = this.alertCtrl.create({
      title: "Event",
      message: "Enter event details",
      inputs: [ { name: "title", placeholder: "Title" },
                { name: "category", placeholder: "Category" },
                { name: "date", placeholder: "Date"} ],
      buttons: [ { text: "Cancel", handler: data => { console.log("Cancel clicked"); } },
                 { text: "Save", handler: data => {
                   this.af.list('/calendarevents').push({
                     title: data.title,
                     category: data.category,
                     yearMonth: data.date
                   });
                 }
               } ]
    });
    prompt.present();
  }

}
