import { Component } from '@angular/core';
import { NavController, MenuController, ModalController, AlertController, ToastController, FabContainer } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { GroceryAddItemPage } from './groceryadditem';
import { GroceryEditItemPage } from './groceryedititem';
import { ListAllSelectedPage } from './listallselected';
import { DinnersPage } from './dinners';

@Component({
  selector: 'page-grocery',
  templateUrl: 'grocery.html'
})
export class GroceryPage {
  section: string;
  remainingItems: number;
  fbGroceryItems: FirebaseListObservable<any>;
  allGroceryItemsView: Object[] = [];
  selectedGroceryItems: Object[] = [];
  addGroceryItemsView: Object[] = [];
  produceGroceryItemsView: Object[] = [];
  centerGroceryItemsView: Object[] = [];
  meatsGroceryItemsView: Object[] = [];
  coldGroceryItemsView: Object[] = [];
  miscGroceryItemsView: Object[] = [];

  constructor(public navCtrl: NavController, menu: MenuController, public modalCtrl: ModalController, public alertCtrl: AlertController, public toastCtrl: ToastController, af: AngularFireDatabase) {
    menu.enable(true);
    this.section = "add";
    this.fbGroceryItems = af.list('/groceryitems');
    af.list('/groceryitems').subscribe(aGroceryItems => {
      this.allGroceryItemsView = [];
      this.selectedGroceryItems = [];
      this.produceGroceryItemsView = [];
      this.centerGroceryItemsView = [];
      this.meatsGroceryItemsView = [];
      this.coldGroceryItemsView = [];
      this.miscGroceryItemsView = [];
      aGroceryItems.forEach(groceryItem => {
        this.allGroceryItemsView.push(groceryItem);
        if (groceryItem.section == "produce" && groceryItem.qtySelected > 0) {
          this.selectedGroceryItems.push(groceryItem);
          this.produceGroceryItemsView.push(groceryItem);
        } else if (groceryItem.section == "center" && groceryItem.qtySelected > 0) {
          this.selectedGroceryItems.push(groceryItem);
          this.centerGroceryItemsView.push(groceryItem);
        } else if (groceryItem.section == "meats" && groceryItem.qtySelected > 0) {
          this.selectedGroceryItems.push(groceryItem);
          this.meatsGroceryItemsView.push(groceryItem);
        } else if (groceryItem.section == "cold" && groceryItem.qtySelected > 0) {
          this.selectedGroceryItems.push(groceryItem);
          this.coldGroceryItemsView.push(groceryItem);
        } else if (groceryItem.section == "misc" && groceryItem.qtySelected > 0) {
          this.selectedGroceryItems.push(groceryItem);
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
    this.addGroceryItemsView.sort(this.sortArrayByItem);
  }

  addItemToList(selectedItem) {
    if (selectedItem.item == "+ Add New") {
      this.addNewGroceryItem(selectedItem.section);
    } else {
      this.fbGroceryItems.update(selectedItem.$key, {qtySelected: ++selectedItem.qtySelected, checked: true, color: ""})
      let toast = this.toastCtrl.create({
        message: 'Selected: ' + selectedItem.item,
        duration: 1500
      });
      toast.present();
    }
    this.getGroceryItems({target: {value: ""}});
    this.countRemainingItems();
  }

  addNewGroceryItemFab(fab: FabContainer) {
    fab.close();
    this.addNewGroceryItem("");
  }

  addNewGroceryItem(newItem) {
    let modal = this.modalCtrl.create(GroceryAddItemPage, {item: newItem});
    modal.onDidDismiss(data => {
      if (data) {
        this.fbGroceryItems.push({item: data.item, section: data.section, aisle: data.aisle, qtySelected: 0, checked: true, color: ""});
// update me !!!!!!
        // this.addItemToList({item: data.item, section: data.section, aisle: data.aisle});
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
    this.fbGroceryItems.update(item.$key, {color: item.color, checked: item.checked});
    this.countRemainingItems();
  }

  countRemainingItems() {
    this.remainingItems = 0;
    let i: number;
    for(i = 0; i < this.produceGroceryItemsView.length; i++) {
      if ((this.produceGroceryItemsView[i] as any).checked) {
        this.remainingItems += (this.produceGroceryItemsView[i] as any).qtySelected;
      }
    }
    for(i = 0; i < this.centerGroceryItemsView.length; i++) {
      if ((this.centerGroceryItemsView[i] as any).checked) {
        this.remainingItems += (this.centerGroceryItemsView[i] as any).qtySelected;
      }
    }
    for(i = 0; i < this.meatsGroceryItemsView.length; i++) {
      if ((this.meatsGroceryItemsView[i] as any).checked) {
        this.remainingItems += (this.meatsGroceryItemsView[i] as any).qtySelected;
      }
    }
    for(i = 0; i < this.coldGroceryItemsView.length; i++) {
      if ((this.coldGroceryItemsView[i] as any).checked) {
        this.remainingItems += (this.coldGroceryItemsView[i] as any).qtySelected;
      }
    }
    for(i = 0; i < this.miscGroceryItemsView.length; i++) {
      if ((this.miscGroceryItemsView[i] as any).checked) {
        this.remainingItems += (this.miscGroceryItemsView[i] as any).qtySelected;
      }
    }
  }

  clearItems(clearType: string, fab: FabContainer) {
    fab.close();
    let message: string = "";
    if (clearType == "all") {
      message = "Clear ALL selected items?";
    } else {
      message = "Clear checked selected items?";
    }
    let prompt = this.alertCtrl.create({
      title: 'Alert',
      message: message,
      buttons: [
        { text: 'Yes', handler: data =>
          {
            if (clearType == "all") {
              this.clearAll();
            } else {
              this.clearChecked();
            }
          }
        },
        { text: 'Cancel', handler: data => {console.log('Cancel clicked');} }
      ]
    });
    prompt.present();
  }

  clearAll() {
    let updateKeys = [];
    for (var i = 0; i < this.selectedGroceryItems.length; i++) {
      updateKeys.push((this.selectedGroceryItems[i] as any).$key);
    }
    for (var j = 0; j < updateKeys.length; j++) {
      this.fbGroceryItems.update(updateKeys[j], {qtySelected: 0, checked: true, color: ""});
    }
    let toast = this.toastCtrl.create({
      message: 'All Selected Items Cleared',
      duration: 3000
    });
    toast.present();
  }

  clearChecked() {
    let updateKeys = [];
    for (var i = 0; i < this.selectedGroceryItems.length; i++) {
      if ((this.selectedGroceryItems[i] as any).checked == false) {
        updateKeys.push((this.selectedGroceryItems[i] as any).$key);
      }
    }
    for (var j = 0; j < updateKeys.length; j++) {
      this.fbGroceryItems.update(updateKeys[j], {qtySelected: 0, checked: true, color: ""});
    }
    let toast = this.toastCtrl.create({
      message: 'All Checked Items Cleared',
      duration: 3000
    });
    toast.present();
  }

  goDinnersPage(fab: FabContainer) {
    fab.close();
    this.navCtrl.push(DinnersPage);
  }

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
