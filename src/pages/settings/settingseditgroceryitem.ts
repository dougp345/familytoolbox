import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  templateUrl: 'settingseditgroceryitem.html'
})
export class SettingsEditGroceryItemPage {
  fbGroceryItems: FirebaseListObservable<any>;
  allGroceryItems: Object[] = [];
  itemInput: string;
  sectionInput: string;
  aisleInput: number;
  gId: string;

  constructor(public navCtrl: NavController, public params: NavParams, public alertCtrl: AlertController, public toastCtrl: ToastController, af: AngularFireDatabase) {
    this.gId = params.get('$key');
    this.itemInput = params.get('item');
    this.sectionInput = params.get('section');
    this.aisleInput = params.get('aisle');
    this.fbGroceryItems = af.list('/allgroceryitems');
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
      this.fbGroceryItems.update(this.gId, {item: this.itemInput, section: this.sectionInput, aisle: this.aisleInput});
      let toast = this.toastCtrl.create({
        message: 'Item Saved Successfully',
        duration: 3000
      });
      toast.present();
      this.navCtrl.pop();
    }
  }

  delete() {
    let prompt = this.alertCtrl.create({
      title: 'Alert',
      message: "Are you sure you'd like to delete this item?",
      buttons: [
        { text: 'Yes', handler: data => {this.deleteItem();} },
        { text: 'Cancel', handler: data => {console.log('Cancel clicked');} }
      ]
    });
    prompt.present();
  }

  deleteItem() {
    this.fbGroceryItems.remove(this.gId);
    let toast = this.toastCtrl.create({
      message: 'Item Deleted Successfully',
      duration: 3000
    });
    toast.present();
    this.navCtrl.pop();
  }
}
