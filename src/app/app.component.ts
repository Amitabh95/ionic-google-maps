import { Component } from '@angular/core';
import { Platform, ModalController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CacheService } from "ionic-cache";

import { HomePage } from '../pages/home/home';
import { SplashNewPage } from '../pages/splash-new/splash-new';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    cache: CacheService,
    modalCtrl: ModalController
  ) {
    platform.ready().then(() => {
       // Set TTL to 12h
       cache.setDefaultTTL(60 * 60 * 12);
 
       // Keep our cached results when device is offline!
       cache.setOfflineInvalidate(false);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //splashScreen.hide();
      let splash = modalCtrl.create(SplashNewPage);
            splash.present();
    });
  }
  
}
                                                                                                                                                                                                                                                                                                
