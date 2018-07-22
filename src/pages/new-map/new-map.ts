import { Component,NgZone, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,  Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FormControl } from '@angular/forms';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/debounceTime';
import { OfflineInterfacePage } from '../offline-interface/offline-interface';

@IonicPage()
@Component({
  selector: 'page-new-map',
  templateUrl: 'new-map.html',
})
export class NewMapPage {
  searchTerm: string = '';
  searchControl: FormControl;
  items: any;
  searching: any = false;
  itemForSearch: any[] = [];
  showSearchBox: boolean = false;

  @ViewChild('map') mapElement: ElementRef;

  map:any;
  latLng:any;
  markers:any;
  mapOptions:any;  
  isKM:any=2500;
  isType:any="";
  placesArray: any[] = [];
  infowindow;
  placeMarker: any[] = [];
  markersFunc:any;
  arrayWithDistance:any;
  directionsService;
  directionsDisplay;
  markersNew: any[] = [];
 
  constructor(
    private ngZone: NgZone,
    private geolocation : Geolocation,
    private navCrtl: NavController,
    private platform:Platform,
    private network: Network,
    private toast: Toast,
    private alertCtrl: AlertController,
    private storage: Storage
  ) { 
        platform.ready().then(() => {
          this.loadMap();
        });
        this.searchControl = new FormControl();
        this.checkNetworkConnectivity();
        
  }

  ionViewDidLoad() {
    
  }

  checkNetworkConnectivity(){
    this.network.onDisconnect().subscribe(() => {
      this.showDisconnectedToast();
      this.presentConfirm();
      console.log('network was disconnected :-(');
    });
    this.network.onConnect().subscribe(() => {
      this.showConnectedToast();
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
        addPixelsY:15
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
        addPixelsY:15
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
          mapTypeId: google.maps.MapTypeId.ROADMAP
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

    }, (err) => {
      console.log('Map loading Error',JSON.stringify(err));
    });
    // this.directionsService = new google.maps.DirectionsService;
    // this.directionsDisplay = new google.maps.DirectionsRenderer;
    // this.directionsDisplay.setMap(this.map);

  }


 /*--------------------Find Nearby Place Starts------------------------*/ 

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
   // this.calculatedDisatanceInArray();
    //console.log('distance', this.arrayWithDistance);
  }


  createMarker(place){
    //console.log('place',place);
      //this.markers = [];
      if(this.markersNew !== undefined){
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
    for (var i = 0; i < this.markersNew.length; i++) {
      this.markersNew[i].setMap(null);
    }
    this.markersNew = [];
  }
  /*--------------------Find Nearby Place Ends------------------------*/ 



  /*--------------------Dynamic search starts------------------------*/ 
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
 
  return this.itemForSearch.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });    

}

pushInObject(){
   this.itemForSearch = [...this.placesArray];
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

  // goToDynamicMap(){
  //   this.navCrtl.push(DynamicMapPage);
  // }

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
}
