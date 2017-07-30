import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-groceryadditem',
  templateUrl: 'groceryadditem.html'
})
export class AddNewGroceryItemPage {
  newItem: string;
  itemInput: string;
  sectionInput: string;
  aisleInput: number;

  constructor(public viewCtrl: ViewController, public params: NavParams, public toastCtrl: ToastController) {
    this.newItem = this.params.get('item')
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  save() {
    if (this.itemInput.length == 0) {
      let toast = this.toastCtrl.create({
        message: 'Item name is required',
        duration: 3000
      });
      toast.present();
    } else if (!this.sectionInput) {
      let toast = this.toastCtrl.create({
        message: 'Section is required',
        duration: 3000
      });
      toast.present();
    } else if (this.sectionInput == 'center' && !this.aisleInput) {
      let toast = this.toastCtrl.create({
        message: 'Aisle is required',
        duration: 3000
      });
      toast.present();
    } else {
      if (!this.aisleInput) {
          this.aisleInput = 0;
      }
      this.viewCtrl.dismiss({item: this.itemInput, section: this.sectionInput, aisle: Number(this.aisleInput)});
    }
  }
}
