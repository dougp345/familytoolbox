import { Component } from '@angular/core';

import { GroceryPage } from '../grocery/grocery';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = GroceryPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
