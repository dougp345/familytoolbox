import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'listallselected.html'
})
export class ListAllSelectedPage {
  allSelected: Object[] = [];
  produceGroceryItemsView: Object[] = [];
  centerGroceryItemsView: Object[] = [];
  meatsGroceryItemsView: Object[] = [];
  coldGroceryItemsView: Object[] = [];
  miscGroceryItemsView: Object[] = [];

  constructor(public viewCtrl: ViewController, public params: NavParams) {
    this.allSelected = this.params.data;
    this.produceGroceryItemsView = [];
    this.centerGroceryItemsView = [];
    this.meatsGroceryItemsView = [];
    this.coldGroceryItemsView = [];
    this.miscGroceryItemsView = [];
    for (var i = 0; i < this.allSelected.length; i++) {
      if ((this.allSelected[i] as any).section == "produce" && (this.allSelected[i] as any).checked == true) {
        this.produceGroceryItemsView.push(this.allSelected[i]);
      } else if ((this.allSelected[i] as any).section == "center" && (this.allSelected[i] as any).checked == true) {
        this.centerGroceryItemsView.push(this.allSelected[i]);
      } else if ((this.allSelected[i] as any).section == "meats" && (this.allSelected[i] as any).checked == true) {
        this.meatsGroceryItemsView.push(this.allSelected[i]);
      } else if ((this.allSelected[i] as any).section == "cold" && (this.allSelected[i] as any).checked == true) {
        this.coldGroceryItemsView.push(this.allSelected[i]);
      } else if ((this.allSelected[i] as any).section == "misc" && (this.allSelected[i] as any).checked == true) {
        this.miscGroceryItemsView.push(this.allSelected[i]);
      }
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
