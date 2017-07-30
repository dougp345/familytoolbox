import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { GroceryAddItemPage } from './groceryadditem';
import { GroceryEditItemPage } from './groceryedititem';
import { ListAllSelectedPage } from './listallselected';

@Component({
  selector: 'page-grocery',
  templateUrl: 'grocery.html'
})
export class GroceryPage {
  section: string;
  remainingItems: number;
  fbGroceryItems: FirebaseListObservable<any>;
  fbSelectedGroceryItems: FirebaseListObservable<any>;
  allGroceryItemsView: Object[] = [];
  selectedGroceryItems: Object[] = [];
  addGroceryItemsView: Object[] = [];
  produceGroceryItemsView: Object[] = [];
  centerGroceryItemsView: Object[] = [];
  meatsGroceryItemsView: Object[] = [];
  coldGroceryItemsView: Object[] = [];
  miscGroceryItemsView: Object[] = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, af: AngularFireDatabase) {
    this.section = "add";
    this.fbGroceryItems = af.list('/allgroceryitems');
    af.list('/allgroceryitems').subscribe(aGroceryItems => {
      this.allGroceryItemsView = [];
      aGroceryItems.forEach(groceryItem => {
        this.allGroceryItemsView.push(groceryItem);
      });
      this.filterGroceryItems();
    });
    this.fbSelectedGroceryItems = af.list('/selectedgroceryitems');
    af.list('/selectedgroceryitems').subscribe(sGroceryItems => {
      this.selectedGroceryItems = [];
      this.produceGroceryItemsView = [];
      this.centerGroceryItemsView = [];
      this.meatsGroceryItemsView = [];
      this.coldGroceryItemsView = [];
      this.miscGroceryItemsView = [];
      sGroceryItems.forEach(groceryItem => {
        this.selectedGroceryItems.push(groceryItem);
        if (groceryItem.section == "produce") {
          this.produceGroceryItemsView.push(groceryItem);
        } else if (groceryItem.section == "center") {
          this.centerGroceryItemsView.push(groceryItem);
        } else if (groceryItem.section == "meats") {
          this.meatsGroceryItemsView.push(groceryItem);
        } else if (groceryItem.section == "cold") {
          this.coldGroceryItemsView.push(groceryItem);
        } else if (groceryItem.section == "misc") {
          this.miscGroceryItemsView.push(groceryItem);
        }
      });
      this.produceGroceryItemsView.sort(this.sortArrayByItem);
      this.centerGroceryItemsView.sort(this.sortArrayByAisle);
      this.meatsGroceryItemsView.sort(this.sortArrayByItem);
      this.coldGroceryItemsView.sort(this.sortArrayByItem);
      this.miscGroceryItemsView.sort(this.sortArrayByItem);
      this.filterGroceryItems();
      this.countRemainingItems();
    });
  }

  getGroceryItems(ev) {
    var val = ev.target.value;
    this.filterGroceryItems();
    if (val && val.trim() != '') {
      this.addGroceryItemsView = this.addGroceryItemsView.filter(function (gItem) {
        return ((gItem as any).item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    if (this.addGroceryItemsView.length == 0) {
      this.addGroceryItemsView.push({item: "+ Add New", section: ev.target.value});
    }
  }

  editGroceryItem(item) {
    this.navCtrl.push(GroceryEditItemPage, item);
  }

  filterGroceryItems() {
    this.addGroceryItemsView = [];
    for (var i = 0; i < this.allGroceryItemsView.length; i++) {
      this.addGroceryItemsView.push(this.allGroceryItemsView[i]);
    }
    // this.addGroceryItemsView = this.subtractArray(this.addGroceryItemsView, this.produceGroceryItemsView);
    // this.addGroceryItemsView = this.subtractArray(this.addGroceryItemsView, this.centerGroceryItemsView);
    // this.addGroceryItemsView = this.subtractArray(this.addGroceryItemsView, this.meatsGroceryItemsView);
    // this.addGroceryItemsView = this.subtractArray(this.addGroceryItemsView, this.coldGroceryItemsView);
    // this.addGroceryItemsView = this.subtractArray(this.addGroceryItemsView, this.miscGroceryItemsView);
    this.addGroceryItemsView.sort(this.sortArrayByItem);
  }

  addItemToList(selectedItem) {
    if (selectedItem.item == "+ Add New") {
      this.addNewGroceryItem(selectedItem.section);
    } else {
      this.fbSelectedGroceryItems.push({item: selectedItem.item, section: selectedItem.section, aisle: selectedItem.aisle, checked: true, color: ""})
      let toast = this.toastCtrl.create({
        message: 'Selected: ' + selectedItem.item,
        duration: 1500
      });
      toast.present();
    }
    this.getGroceryItems({target: {value: ""}});
    this.countRemainingItems();
  }

  addNewGroceryItem(newItem) {
    let modal = this.modalCtrl.create(GroceryAddItemPage, {item: newItem});
    modal.onDidDismiss(data => {
      if (data) {
        this.fbGroceryItems.push({item: data.item, section: data.section, aisle: data.aisle});
        this.addItemToList({item: data.item, section: data.section, aisle: data.aisle});
      }
    });
    modal.present();
  }

  listAllSelected() {
    let modal = this.modalCtrl.create(ListAllSelectedPage, this.selectedGroceryItems);
    modal.present();
  }

  toggleItem(item) {
    item.checked = !item.checked;
    if (item.checked) {
      item.color = "";
    } else {
      item.color = "light";
    }
    this.fbSelectedGroceryItems.update(item.$key, {color: item.color, checked: item.checked});
    this.countRemainingItems();
  }

  countRemainingItems() {
    this.remainingItems = 0;
    let i: number;
    for(i = 0; i < this.produceGroceryItemsView.length; i++) {
      if ((this.produceGroceryItemsView[i] as any).checked) {
        this.remainingItems += 1;
      }
    }
    for(i = 0; i < this.centerGroceryItemsView.length; i++) {
      if ((this.centerGroceryItemsView[i] as any).checked) {
        this.remainingItems += 1;
      }
    }
    for(i = 0; i < this.meatsGroceryItemsView.length; i++) {
      if ((this.meatsGroceryItemsView[i] as any).checked) {
        this.remainingItems += 1;
      }
    }
    for(i = 0; i < this.coldGroceryItemsView.length; i++) {
      if ((this.coldGroceryItemsView[i] as any).checked) {
        this.remainingItems += 1;
      }
    }
    for(i = 0; i < this.miscGroceryItemsView.length; i++) {
      if ((this.miscGroceryItemsView[i] as any).checked) {
        this.remainingItems += 1;
      }
    }
  }

  clearItems() {
    let prompt = this.alertCtrl.create({
      title: 'Alert',
      message: "Which selected items would you like to clear?",
      buttons: [
        { text: 'All', handler: data => {this.clearAll();} },
        { text: 'Checked', handler: data => {this.clearChecked();} },
        { text: 'Cancel', handler: data => {console.log('Cancel clicked');} }
      ]
    });
    prompt.present();
  }

  clearAll() {
    this.fbSelectedGroceryItems.remove();
    let toast = this.toastCtrl.create({
      message: 'All Selected Items Cleared',
      duration: 3000
    });
    toast.present();
  }

  clearChecked() {
    let deleteKeys = [];
    for (var i = 0; i < this.selectedGroceryItems.length; i++) {
      if ((this.selectedGroceryItems[i] as any).checked == false) {
        deleteKeys.push((this.selectedGroceryItems[i] as any).$key);
      }
    }
    for (var j = 0; j < deleteKeys.length; j++) {
        this.fbSelectedGroceryItems.remove(deleteKeys[j]);
    }
    let toast = this.toastCtrl.create({
      message: 'All Checked Items Cleared',
      duration: 3000
    });
    toast.present();
  }

  // subtractArray(a, b) {
  //   for (var i = 0; i < a.length; i++) {
  //     var ai = a[i];
  //     for (var j = 0; j < b.length; j++) {
  //       var bj = b[j];
  //       if (ai.item == bj.item && ai.section == bj.section) {
  //         a.splice(i, 1);
  //       }
  //     }
  //   }
  //   return a;
  // };

  sortArrayByItem(a,b) {
    if (a.item.toLowerCase() < b.item.toLowerCase())
      return -1;
    if (a.item.toLowerCase() > b.item.toLowerCase())
      return 1;
    return 0;
  }

  sortArrayByAisle(a,b) {
    if (a.aisle < b.aisle)
      return -1;
    if (a.aisle > b.aisle)
      return 1;
    return 0;
  }

}
