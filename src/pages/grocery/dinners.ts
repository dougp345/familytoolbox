import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';

import { DinnerEditPage } from './dinneredit';

@Component({
  selector: 'page-dinners',
  templateUrl: 'dinners.html'
})
export class DinnersPage {
  allGroceryDinnersView: Object[] = [];
  dinnerCardsView: Object[] = [];
  fbGroceryDinners: FirebaseListObservable<any>;
  firestore = firebase.storage();

  constructor(public navCtrl: NavController, af: AngularFireDatabase) {
    this.fbGroceryDinners = af.list('/grocerydinners');
    af.list('/grocerydinners').subscribe(aGroceryDinners => {
      this.allGroceryDinnersView = [];
      aGroceryDinners.forEach(groceryDinner => {
        this.allGroceryDinnersView.push(groceryDinner);
      });
      for (var i = 0; i < this.allGroceryDinnersView.length; i++) {
        // (this.allGroceryDinnersView[i] as any).imgSource = this.getImageSource((this.allGroceryDinnersView[i] as any).image);
        (this.allGroceryDinnersView[i] as any).imgSource = "https://firebasestorage.googleapis.com/v0/b/familytoolbox-57e73.appspot.com/o/default.jpg?alt=media&token=0d687365-5d52-4270-b11c-cc1cb99d0b46";
        this.dinnerCardsView.push(this.allGroceryDinnersView[i]);
      }
    });
  }

  addDinner() {
    this.navCtrl.push(DinnerEditPage);
  }

  editDinner(dinner) {
    this.navCtrl.push(DinnerEditPage, {dinnerItem: dinner});
  }

  getImageSource(filename) {
    this.firestore.ref().child(filename).getDownloadURL()
      .then((url) => { return url; })
      .catch(() => { return "https://firebasestorage.googleapis.com/v0/b/familytoolbox-57e73.appspot.com/o/default.jpg?alt=media&token=0d687365-5d52-4270-b11c-cc1cb99d0b46"; });
  }

}
