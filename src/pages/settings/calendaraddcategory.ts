import { Component } from '@angular/core';
import { ViewController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-calendaraddcategory',
  templateUrl: 'calendaraddcategory.html'
})
export class CalendarAddCategoryPage {
  categoryInput: string;
  categoryColorInput: string;

  constructor(public viewCtrl: ViewController, public toastCtrl: ToastController) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {
    if (this.categoryInput.length == 0) {
      let toast = this.toastCtrl.create({
        message: 'Category name is required',
        duration: 3000
      });
      toast.present();
    } else if (this.categoryColorInput.length == 0) {
      let toast = this.toastCtrl.create({
        message: 'Color is required',
        duration: 3000
      });
      toast.present();
    } else {
      this.viewCtrl.dismiss({category: this.categoryInput, color: this.categoryColorInput});
    }
  }
}
