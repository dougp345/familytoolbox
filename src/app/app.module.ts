import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { GroceryPage } from '../pages/grocery/grocery';
import { AddNewGroceryItemPage } from '../pages/grocery/groceryadditem';
import { SettingsPage } from '../pages/settings/settings';
import { SettingsEditGroceryItemsPage } from '../pages/settings/settingseditgroceryitems';
import { SettingsEditGroceryItemPage } from '../pages/settings/settingseditgroceryitem';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

export const firebaseConfig = {
  apiKey: "AIzaSyA7Og9OWyAemE7CYT4D_4lPuLrXqcIR1zA",
  authDomain: "familytoolbox-57e73.firebaseapp.com",
  databaseURL: "https://familytoolbox-57e73.firebaseio.com",
  projectId: "familytoolbox-57e73",
  storageBucket: "familytoolbox-57e73.appspot.com",
  messagingSenderId: "159411358722"
}

@NgModule({
  declarations: [
    MyApp,
    GroceryPage,
    AddNewGroceryItemPage,
    SettingsPage,
    SettingsEditGroceryItemsPage,
    SettingsEditGroceryItemPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GroceryPage,
    AddNewGroceryItemPage,
    SettingsPage,
    SettingsEditGroceryItemsPage,
    SettingsEditGroceryItemPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
