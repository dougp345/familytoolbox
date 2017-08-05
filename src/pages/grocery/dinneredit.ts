import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';

@Component({
  templateUrl: 'dinneredit.html'
})
export class DinnerEditPage {
  dinnerItem: {};
  pageTitle: string = "";
  dinnerName: string = "";
  dinnerImage: string = "";
  dinnerGroceryItems: string[] = [];
  dinnerGroceryItemsView: Object[] = [];
  addItemsGroceryItemsView: Object[] = [];
  fbGroceryDinners: FirebaseListObservable<any>;
  fbGroceryItems: FirebaseListObservable<any>;
  firestore = firebase.storage();
  imgsource: any;

  constructor(public navCtrl: NavController, public params: NavParams, public alertCtrl: AlertController, public toastCtrl: ToastController, af: AngularFireDatabase) {
    this.dinnerItem = this.params.get("dinnerItem");
    this.fbGroceryDinners = af.list('/grocerydinners');
    this.fbGroceryItems = af.list('/groceryitems');
    if (this.dinnerItem) {
      this.pageTitle = "Edit Dinner";
      this.dinnerName = (this.dinnerItem as any).name;
      this.dinnerImage = (this.dinnerItem as any).image;
      this.dinnerGroceryItems = (this.dinnerItem as any).groceryItems;
    } else {
      this.pageTitle = "Add Dinner";
    }
    af.list('/groceryitems').subscribe(aGroceryItems => {
      aGroceryItems.forEach(groceryItem => {
        this.dinnerGroceryItemsView.push(groceryItem);
      });
      this.dinnerGroceryItemsView.sort(this.sortArrayByItem);
    });
  }

  // store() {
  //   this.fileChooser.open()
  //     .then((url) => {
  //       this.filePath.resolveNativePath(url)
  //         .then(filePath => {
  //             console.log(filePath);
  //             this.uploadimage(filePath);
  //         })
  //         .catch(err => console.log(err));
  //     })
  //     .catch(e => console.log(e));
  // }
  //
  // uploadimage(filePath) {
  //   this.file.resolveLocalFilesystemUrl(filePath)
  //     .then((res) => {
  //       (res as any).file((resFile) => {
  //         var reader = new FileReader();
  //         reader.readAsArrayBuffer(resFile);
  //         reader.onloadend = (evt: any) => {
  //           var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
  //           var imageStore = this.firestore.ref().child('image');
  //           imageStore.put(imgBlob).then((res) => {
  //             alert('Upload Success');
  //           }).catch((err) => {
  //             alert('Upload Failed' + err);
  //           })
  //         }
  //       })
  //     })
  //     .catch(e => console.log(e));
  // }

  display(filename) {
    this.firestore.ref().child(filename).getDownloadURL().then((url) => {
      this.imgsource = url;
    })
  }

  saveDinner() {
    if (!this.dinnerImage) {
      this.dinnerImage = "default.jpg";
    }
    if (this.dinnerItem) {
      this.fbGroceryDinners.update((this.dinnerItem as any).$key, {name: this.dinnerName, image: this.dinnerImage, groceryItems: this.dinnerGroceryItems}).then(() => this.goBack());
    } else {
      this.fbGroceryDinners.push({name: this.dinnerName, image: this.dinnerImage, groceryItems: this.dinnerGroceryItems}).then(() => this.goBack());
    }
  }

  addItemsToList() {
    var itemsToUpdate: Object[] = [];
    this.addItemsGroceryItemsView = [];
    for (var i = 0; i < this.dinnerGroceryItems.length; i++) {
      for (var j = 0; j < this.dinnerGroceryItemsView.length; j++) {
        if (this.dinnerGroceryItems[i] == (this.dinnerGroceryItemsView[j] as any).$key) {
          this.addItemsGroceryItemsView.push(this.dinnerGroceryItemsView[j]);
          break;
        }
      }
    }
    let alert = this.alertCtrl.create();
    alert.setTitle('Which items to add to Grocery list?');
    for (var a = 0; a < this.addItemsGroceryItemsView.length; a++) {
      alert.addInput({
        type: 'checkbox',
        label: (this.addItemsGroceryItemsView[a] as any).item + " (" + (this.addItemsGroceryItemsView[a] as any).qtySelected + ")",
        value: (this.addItemsGroceryItemsView[a] as any).$key,
        checked: true
      });
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Add',
      handler: data => {
        for (var y = 0; y < data.length; y++) {
          for (var z = 0; z < this.addItemsGroceryItemsView.length; z++) {
            if (data[y] == (this.addItemsGroceryItemsView[z] as any).$key) {
              itemsToUpdate.push(this.addItemsGroceryItemsView[z]);
            }
          }
        }
        for (var x = 0; x < itemsToUpdate.length; x++) {
          this.fbGroceryItems.update((itemsToUpdate[x] as any).$key, {qtySelected: ++(itemsToUpdate[x] as any).qtySelected, checked: true, color: ""})
        }
        let toast = this.toastCtrl.create({
          message: itemsToUpdate.length + ' items added to Grocery list',
          duration: 1500
        });
        toast.present();
        this.goBack();
      }
    });
    alert.present();
  }

  goBack() {
    this.navCtrl.pop();
  }

  sortArrayByItem(a,b) {
    if (a.item.toLowerCase() < b.item.toLowerCase())
      return -1;
    if (a.item.toLowerCase() > b.item.toLowerCase())
      return 1;
    return 0;
  }
}
