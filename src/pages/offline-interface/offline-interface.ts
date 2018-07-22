import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the OfflineInterfacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offline-interface',
  templateUrl: 'offline-interface.html',
})
export class OfflineInterfacePage {
searchControl: FormControl;
isType: any;
resultArray: any[] = [];
showSearchBox: boolean = false;
searching: boolean = false;
searchTerm: string = '';
items:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage
  ) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfflineInterfacePage');
  }

  getValueFromStorage(isType){
    this.onSearchInput();
    this.storage.get(isType).then((value) =>{
      this.resultArray = JSON.parse(value);
      this.showSearchBox = true;
    },
    (error) => {
      console.log('error', error)
    });
  }


  onSearchInput(){
    this.searching = true;
    this.setFilteredItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false;
            this.setFilteredItems();
    });
}


setFilteredItems() {
    this.items = this.filterItems(this.searchTerm);

}

filterItems(searchTerm){
  let temp =this.resultArray;
 
  return temp.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });    

}

}

