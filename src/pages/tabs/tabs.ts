import { Component } from '@angular/core';

import { GroceryPage } from '../grocery/grocery';
import { SettingsPage } from '../settings/settings';
import { CalendarPage } from '../calendar/calendar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CalendarPage;
  tab2Root = GroceryPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}
