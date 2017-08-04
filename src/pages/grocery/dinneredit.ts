import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';

@Component({
  templateUrl: 'dinneredit.html'
})
export class DinnerEditPage {
  allGroceryItems: Object[] = [];
  dinnerItem: {};
  pageTitle: string = "";
  dinnerName: string = "";
  dinnerImage: string = "";
  dinnerGroceryItems: string[] = [];
  dinnerGroceryItemsView: Object[] = [];
  fbGroceryDinners: FirebaseListObservable<any>;
  firestore = firebase.storage();
  imgsource: any;

  constructor(public navCtrl: NavController, public params: NavParams, af: AngularFireDatabase, public zone: NgZone) {
    this.fbGroceryDinners = af.list('/grocerydinners');
    this.allGroceryItems = this.params.get("groceryItems");
    this.dinnerItem = this.params.get("dinnerItem");
    if (this.dinnerItem) {
      this.pageTitle = "Edit Dinner";
      this.dinnerName = (this.dinnerItem as any).name;
      this.dinnerImage = (this.dinnerItem as any).image;
      this.dinnerGroceryItems = (this.dinnerItem as any).groceryItems;
      for (var i = 0; i < this.dinnerGroceryItems.length; i++) {
        for (var j = 0; j < this.allGroceryItems.length; j++) {
          if ((this.dinnerGroceryItems[i] as any).$key == (this.allGroceryItems[j] as any).$key) {
            this.dinnerGroceryItemsView.push(this.allGroceryItems[j]);
            break;
          }
        }
      }
    } else {
      this.pageTitle = "Add Dinner";
    }
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
      this.zone.run(() => {
        this.imgsource = url;
       })
    })
  }

  saveDinner() {
    if ((this.dinnerItem as any).$key) {
      this.fbGroceryDinners.update((this.dinnerItem as any).$key, {name: this.dinnerName, image: this.dinnerImage, groceryItems: this.dinnerGroceryItems});
    } else {
      this.fbGroceryDinners.push({name: this.dinnerName, image: this.dinnerImage, groceryItems: this.dinnerGroceryItems});
    }
  }

  goBack() {
    this.navCtrl.pop();
  }
}
