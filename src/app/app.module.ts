import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation'; 
import { Network } from '@ionic-native/network';
import { CacheModule } from 'ionic-cache';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Toast } from '@ionic-native/toast';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DynamicMapPage } from '../pages/dynamic-map/dynamic-map';
import { NewMapPage } from '../pages/new-map/new-map';
import { OfflineInterfacePage } from '../pages/offline-interface/offline-interface';
import { SplashNewPage } from '../pages/splash-new/splash-new';
import { CheckConnectivityProvider } from '../providers/check-connectivity/check-connectivity';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DynamicMapPage,
    NewMapPage,
    OfflineInterfacePage,
    SplashNewPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CacheModule.forRoot({keyPrefix: 'map-app-cache'}),
    IonicStorageModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DynamicMapPage,
    NewMapPage,
    OfflineInterfacePage,
    SplashNewPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    Network,
    Toast,
    CheckConnectivityProvider,
  ]
})
export class AppModule {}
