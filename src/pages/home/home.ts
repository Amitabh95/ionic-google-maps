import { Component,NgZone, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform, Events } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FormControl } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/debounceTime';
import { OfflineInterfacePage } from '../offline-interface/offline-interface';
import { CheckConnectivityProvider } from '../../providers/check-connectivity/check-connectivity';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  searching: any = false;
  itemForSearch: any[] = [];
  showSearchBox: boolean = false;
  search: boolean = false;

  @ViewChild('map') mapElement: ElementRef;

  map:any;
  latLng:any;
  markers: any[] = [];
  mapOptions:any;  
  isKM:any=1500;
  isType:string = '';
  placesArray: any[] = [];
  infowindow;
  placeMarker: any[] = [];
  markersFunc:any;
 // arrayWithDistance:any;
  //directionsService;
  // directionsDisplay;
  // markersNew: any[] = [];
  resultArray: any[] = [];
  hospitalList: any[]= [];
  restaurantList: any[] = [];
  connected: boolean;
  disconnectedCounter: number = 0;

  constructor(
    private ngZone: NgZone,
    private geolocation : Geolocation,
    private platform:Platform,
    private network: Network,
    private navCrtl: NavController,
    private toast: Toast,
    private alertCtrl: AlertController,
    private storage: Storage,
   // private checkConnectivityProvider: CheckConnectivityProvider,
    private eventCtrl: Events
  ) { 
        platform.ready().then(() => {
          this.loadMap();
        });
        this.connected = false;
        this.searchControl = new FormControl();
        
  }

  ionViewDidLoad() {
   this.checkNetworkConnectivity();
  }

  checkNetworkConnectivity(){
    
    this.network.onConnect().subscribe(() => {
        this.connected = true;
      this.showConnectedToast();
      console.log('network connected!');
    });

    this.network.onDisconnect().subscribe(() => {

      if(this.connected === false){
        this.showDisconnectedToast();
        this.presentConfirm();
      }
      console.log('network was disconnected :-(');
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

  showDisconnectedToast(){
    let toastOption = {
      message : 'Oops, You are offline...!!',
      duration: 5000,
      position: 'top',
      styling: {
        backgroundColor: 'red',
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
      title: 'Network Disconnected',
      message: 'Do you want to use this app in offline mode?',
      buttons: [
        {
          text: 'Yes',
          role: 'Proceed to offline mode.',
          handler: () => {
            this.navCrtl.push(OfflineInterfacePage);
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.closeApp();
          }
        }
      ]
    });
    alert.present();
  }

  closeApp(){
    this.platform.exitApp();
  }




  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {
        this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.mapOptions = {
          center: this.latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
        //console.log('placeid',position);
      
let marker = this.putMarker(this.latLng, 1);
      //let image = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      // let marker = new google.maps.Marker({
      //   position: this.latLng,
      //   map: this.map,
      //   icon: image,
      //   title: 'You are Here!!'
      // });
      this.infowindow = new google.maps.InfoWindow();
      this.infowindow.close();
      this.infowindow.setContent('You are Here!!');
      //this.infowindow.open(this.map, marker);

    }, (err) => {
      console.log('Map loading Error',JSON.stringify(err));
    });
  }


 /*--------------------Find Nearby Place Starts------------------------*/ 


 nearbyPlace(isType){
  this.search = false;
  this.showSearchBox = true;
  this.searching = false;
  this.deleteMarkers();
  this.isType = isType;
  let service = new google.maps.places.PlacesService(this.map);
       service.nearbySearch({
          location: this.latLng,
          radius: this.isKM,
          types: [isType]
        },
        (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          if(this.placesArray !== null || this.placesArray !== undefined){
            this.placesArray = [];
          }
            results.forEach((item) => {
              let tempMarker = new google.maps.Marker({
                map: this.map,
                position: item.geometry.location,
                title: item.name
            });
          this.infowindow = new google.maps.InfoWindow();
          this.markers.push(tempMarker);
          google.maps.event.addListener(tempMarker, 'click', () => {
        
        this.ngZone.run(() => {
          this.infowindow.close();
          this.infowindow.setContent('<img src="'+item.icon +'"width=15px/>' +'&nbsp;&nbsp;&nbsp; <b>' + item.name+'</b>' +'<br>' + item.vicinity);
          this.infowindow.open(this.map, tempMarker);
        });

      });
  });
        let bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
        bounds.extend(this.markers[i].getPosition());
        }

        this.map.fitBounds(bounds);
      }
      this.storage.set(this.isType, JSON.stringify(this.itemForSearch));
      console.log('item for search', this.itemForSearch);
      this.getValueFromStorage(this.isType);
      console.log('result', this.resultArray);
    });
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

 
/*
  nearbyPlace(isType){
    this.isType = isType;
    this.onSearchInput();
    this.showSearchBox = true;
      //this.loadMap();
      this.markers = [];
      this.placesArray = [];
      let service = new google.maps.places.PlacesService(this.map);
       service.nearbySearch({
          location: this.latLng,
          radius: this.isKM,
          types: [isType]
      },
      (results, status) => {
          this.callback(results, status);
      });
    }

  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((item, i) => {
        this.createMarker(results[i]);
      });
    }
    //console.log('placcc',this.placeMarker);
    //console.log('marker array',this.markers);
    console.log('Places array',this.placesArray);

    // this.storage.get(this.isType).then((value) =>{
    //   if( value === null || value === undefined){
    //     this.storage.set(this.isType, JSON.stringify(this.placesArray));
    //   }
    //   else {
    //     return;
    //   }
    // },
    // (error) => {
    //   console.log('error', error)
    // });
    console.log('type',this.isType);
    this.storage.set(this.isType, JSON.stringify(this.placesArray));
    console.log('marker new',this.markersNew);
   // this.calculatedDisatanceInArray();
    //console.log('distance', this.arrayWithDistance);
  }


  createMarker(place){
    //console.log('place',place);
      //this.markers = [];
      if(this.markersNew !== undefined || this.markersNew !== null){
        this.deleteMarkers();
      }
      
      this.pushInObject();
      this.markersNew = this.putMarker(place,2);
      this.markers.push(this.markersNew);
      this.placesArray.push(place);
      
     
      //console.log('location',place.geometry.location);
      this.infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(this.markersNew, 'click', () => {
        
        this.ngZone.run(() => {
          this.infowindow.close();
          this.infowindow.setContent('<img src="'+place.icon +'"width=15px/>' +'&nbsp;&nbsp;&nbsp; <b>' + place.name+'</b>' +'<br>' + place.vicinity);
          this.infowindow.open(this.map, this.markersNew);
          
        });

      });
  }

  deleteMarkers() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }


  */
 deleteMarkers() {
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(null);
  }
  this.markers = [];
}


  /*--------------------Find Nearby Place Ends------------------------*/ 



  /*--------------------Dynamic search starts------------------------*/ 
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

// filterItems(searchTerm){
 
//   return this.placesArray.filter((item) => {
//       return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
//   });    

// }
filterItems(searchTerm){
  let temp =this.itemForSearch;
 
  return temp.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });    

}



 /*--------------------Dynamic search Ends------------------------*/ 

//  calculateDistance(latlng){
//   this.calculateAndDisplayRoute(this.directionsService, this.directionsDisplay,latlng);
//  }

//  calculateAndDisplayRoute(directionsService, directionsDisplay,latlng) {
//   directionsService.route({
//     origin: this.latLng,
//     destination: latlng,
//     travelMode: 'DRIVING'
//   }, function(response, status) {
//     if (status === 'OK') {
//       directionsDisplay.setDirections(response);
//     } else {
//       window.alert('Directions request failed due to ' + status);
//     }
//   });
// }


//  calculatedDisatanceInArray(){
//    this.placesArray.forEach(places => {
//      let arrayWithDistanceTemp = this.arrayWithDistance;
//     let latLng = new google.maps.LatLng(places.geometry.location.lat(), places.geometry.location.lng());
//     console.log('infunction',latLng);
//     let calculatedDistance = this.calculateDistance(latLng);
//     console.log('there',calculatedDistance);
//     //arrayWithDistanceTemp.push(calculatedDistance);
//    });
//  }

markSelectedPlace(placeIDReceived){
  let tempMap = this.map;
  let tempPlaceMarkerArray = this.placeMarker;
  let markerArrayIndex ;
  let markerFuncton = this.markersFunc;
  let service = new google.maps.places.PlacesService(tempMap);
    service.getDetails({
        placeId: placeIDReceived
    }, function (result, status) {
      let latitude = result.geometry.location.lat();
        let longitude = result.geometry.location.lng();
        let resultName = result.name;
        let bounds = new google.maps.LatLngBounds();
        let markerSelected = new google.maps.Marker({
              position: new google.maps.LatLng(latitude,longitude),
              map: tempMap,
              title: resultName
        });
      tempPlaceMarkerArray.forEach((markerPlaceId,i) => {
            if(markerPlaceId === placeIDReceived){
              markerArrayIndex = i;
              
            }
      });
      //setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        
          bounds.extend(markerSelected.getPosition());
          tempMap.fitBounds(bounds);
          let zoomChangeBoundsListener = 
          google.maps.event.addListenerOnce(tempMap, 'bounds_changed', function(event) {
          if ((this.getZoom()) && (this.getZoom() !== null)){
              this.setZoom(19);
          } });
          setTimeout(function(){google.maps.event.removeListener(zoomChangeBoundsListener)}, 2000);
          let tempInfoWindow = new google.maps.InfoWindow();
          tempInfoWindow.close();
          tempInfoWindow.setContent(result.name);
          tempInfoWindow.open(tempMap, markerSelected);
  });
}

  goToOffline(){
    this.navCrtl.push(OfflineInterfacePage);
  }

  // getPlaceIdFromLatLong(latlng){
  //   let geocoder = new google.maps.Geocoder;
  //   geocoder.geocode({'location': latlng}, function(results, status) {
  //     if (status === google.maps.GeocoderStatus.OK) {
  //       if (results[1]) {
  //         console.log(results[1].place_id);
  //          return results[1].place_id;
  //       } else {
  //         // window.alert('No results found');
  //         console.log('No results found');
  //         return false;
  //       }
  //     } else {
  //      // window.alert('Geocoder failed due to: ' + status);
  //       console.log('Geocoder failed due to: ' + status);
  //         return false;
  //     }
  //   });
  // }


  // putMarker(placeId : string,requiredFor ?: string){

  // }

    /*
    **requiredFor**
    1 - Current postions
    2 - Nearby Places
    */

  putMarker(place, requiredFor ?: number){
      if(requiredFor === 1){
        let marker = new google.maps.Marker({
          position: this.latLng,
          map: this.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          title: 'You are Here!!'
        });
        return marker;
      }
      else if(requiredFor === 2){
        
        this.markersFunc = new google.maps.Marker({
          map: this.map,
          position: place.geometry.location,
          title: place.name
      });
      this.placeMarker.push(place.place_id);
      return this.markersFunc;
      }
  }


  getRestaurants(latLng){
    var service = new google.maps.places.PlacesService(this.map);
    let request = {
      location: latLng,
      radius: this.isKM,
      types: ['restaurant']
    };
    return new Promise((resolve,reject) => {
      service.nearbySearch(request,function(results,status){
        if(status === google.maps.places.PlacesServiceStatus.OK){
          resolve(results);
        }
        else{
          reject(status);
        }
      });
    });
  }

  makeRestaurantsList(){
    this.itemForSearch = [];
    this.getRestaurants(this.latLng).then((results: Array<any>) => {
      this.itemForSearch = results;
      this.nearbyPlace('restaurant');
    });
  }





makeHospitalList(){
  this.itemForSearch = [];
  this.getHospitals(this.latLng).then((results: Array<any>) => {
    this.itemForSearch = results;
   this.nearbyPlace('hospital');
});
}
  

  getHospitals(latLng){
    let service = new google.maps.places.PlacesService(this.map);
    let request = {
      location: latLng,
      radius: this.isKM,
      types: ['hospital','health']
    };
    return new Promise((resolve,reject) => {
      service.nearbySearch(request,function(results,status){
        if(status === google.maps.places.PlacesServiceStatus.OK){
          resolve(results);
        }
        else{
          reject(status);
        }
      });
    });
  }
  
}
