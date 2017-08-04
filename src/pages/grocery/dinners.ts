import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { DinnerEditPage } from './dinneredit';

@Component({
  templateUrl: 'dinners.html'
})
export class DinnersPage {
  allGroceryItems: Object[] = [];
  allGroceryDinnersView: Object[] = [];
  dinnerCardsView: Object[] = [];
  fbGroceryDinners: FirebaseListObservable<any>;

  constructor(public navCtrl: NavController, public params: NavParams, af: AngularFireDatabase) {
    this.allGroceryItems = this.params.data;
    this.fbGroceryDinners = af.list('/grocerydinners');
    af.list('/grocerydinners').subscribe(aGroceryDinners => {
      this.allGroceryDinnersView = [];
      aGroceryDinners.forEach(groceryDinner => {
        this.allGroceryDinnersView.push(groceryDinner);
      });
    });
  }

  addDinner() {
    this.navCtrl.push(DinnerEditPage, {groceryItems: this.allGroceryItems});
  }

  editDinner(dinner) {
    this.navCtrl.push(DinnerEditPage, {dinnerItem: dinner, groceryItems: this.allGroceryItems});
  }

}
