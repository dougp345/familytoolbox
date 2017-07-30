import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { SettingsEditGroceryItemPage } from './settingseditgroceryitem';

@Component({
  templateUrl: 'settingseditgroceryitems.html'
})
export class SettingsEditGroceryItemsPage {
  fbGroceryItems: FirebaseListObservable<any>;
  allGroceryItems: Object[] = [];

  constructor(public navCtrl: NavController, af: AngularFireDatabase) {
    this.fbGroceryItems = af.list('/allgroceryitems');
    af.list('/allgroceryitems').subscribe(aGroceryItems => {
      this.allGroceryItems = [];
      aGroceryItems.forEach(groceryItem => {
        this.allGroceryItems.push(groceryItem);
      });
    });
  }

  editGroceryItem(item) {
    this.navCtrl.push(SettingsEditGroceryItemPage, item);
  }

}
