import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';

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
searchBox: boolean = false;
search: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public network: Network,
    private navCrtl: NavController,
    private toast: Toast,
    private alertCtrl: AlertController,
  ) {
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    this.checkNetworkConnectivity();
   }

   checkNetworkConnectivity(){
    
    this.network.onConnect().subscribe(() => {
      this.showConnectedToast();
      this.navCrtl.pop();
      console.log('network connected!');
    });

  }

  showConnectedToast(){
    let toastOption = {
      message : 'Hurrah, You are online now...!!',
      duration: 5000,
      position: 'top',
      styling: {
        backgroundColor: 'green',
        textColor: 'white',
        cornerRadius: 10,
        addPixelsY:150
      }
    }
    this.toast.showWithOptions(toastOption).subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Network Connected',
      message: 'Proceed to online mode.',
      buttons: [
        {
          text: 'Okay',
          role: 'Proceed to offline mode.',
          handler: () => {
            this.navCrtl.pop();
          }
        }
      ]
    });
    alert.present();
  }


  getValueFromStorage(isType){
    this.search = false;
    this.showSearchBox = true;
    this.storage.get(isType).then((value) =>{
      this.resultArray = JSON.parse(value);
    },
    (error) => {
      console.log('error', error)
    });
  }


  onSearchInput(){
    this.search = true;
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

