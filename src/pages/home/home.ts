import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { googlemaps } from 'googlemaps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;

  map:any;
  latLng:any;
  markers:any;
  mapOptions:any;  
  isKM:any=500;
  isType:any="";
  placesArray: any[] = [];
 
  constructor(private ngZone: NgZone, private geolocation : Geolocation) { }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

        this.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          console.log('latLng',this.latLng);
          let infowindow = new google.maps.InfoWindow();
      this.mapOptions = {
        center: this.latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }   

      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

    }, (err) => {
      console.log(JSON.stringify(err));
      alert('err '+err);
    });

  }


 /*--------------------Find Nearby Place------------------------*/ 
   

  nearbyPlace(isType){
    //this.loadMap();
    this.markers = [];
    console.log('**',this.placesArray);
    this.placesArray = [];
    let service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
              location: this.latLng,
              radius: this.isKM,
              types: [isType]
            }, (results, status) => {
                //this.callback(results, status);
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                  results.forEach((item, i) => {
                  this.createMarker(results[i]);
                  // console.log(item);
                  // console.log(i);
                });
              }
            });
  }

  // callback(results, status) {
  //   if (status === google.maps.places.PlacesServiceStatus.OK) {
  //       results.forEach((item, i) => {
  //       this.createMarker(results[i]);
  //       // console.log(item);
  //       // console.log(i);
  //     });
  //   }

    
  // }

  createMarker(place){
    this.markers = [];
    this.placesArray.push(place);
    //var placeLoc = place;

   // console.log('placeLoc',place);
    this.markers = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location
    });

    let infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(this.markers, 'click', () => {
      this.ngZone.run(() => {
        infowindow.setContent(place.name);
        infowindow.open(this.map, this.markers);
      });
    });
  }
}