import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { CalendarAddCategoryPage } from './calendaraddcategory';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settingsSection: string;
  fbCalendarCategories: FirebaseListObservable<any>;
  allCalendarCategories: Object[] = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public toastCtrl: ToastController, af: AngularFireDatabase) {
    this.settingsSection = "calendar";
    this.fbCalendarCategories = af.list('/calendarcategories');
    af.list('/calendarcategories').subscribe(aCalendarCategories => {
      this.allCalendarCategories = [];
      aCalendarCategories.forEach(calendarCategory => {
        this.allCalendarCategories.push(calendarCategory);
      });
    });
  }

  addNewCalendarCategory() {
    let modal = this.modalCtrl.create(CalendarAddCategoryPage);
    modal.onDidDismiss(data => {
      if (data) {
        this.fbCalendarCategories.push({category: data.category, color: data.color});
        let toast = this.toastCtrl.create({
          message: 'Category ' + data.category + ' added',
          duration: 3000
        });
        toast.present();
      }
    });
    modal.present();
  }

}
