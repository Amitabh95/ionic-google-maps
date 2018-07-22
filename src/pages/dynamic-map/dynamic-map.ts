import { Component,  ElementRef,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { googlemaps } from 'googlemaps';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the DynamicMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-dynamic-map',
  templateUrl: 'dynamic-map.html',
})


export class DynamicMapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation : Geolocation, platform:Platform) {
    platform.ready().then(() => {
      this.initMap();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DynamicMapPage');
  }
  initMap() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      let infowindow = new google.maps.InfoWindow();
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        zoom: 15,
        center: mylocation
      });
    });
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.deleteMarkers();
      let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      let image = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      this.addMarker(updatelocation,image);
      this.setMapOnAll(this.map);
    });
  }
  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image,
      title: 'You are Here!!'
    });
    this.markers.push(marker);
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }
}
