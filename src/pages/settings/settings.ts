import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsEditGroceryItemsPage } from './settingseditgroceryitems';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController) {

  }

  editGroceryItems() {
    this.navCtrl.push(SettingsEditGroceryItemsPage);
  }

}
