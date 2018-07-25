import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';

export enum ConnectionStatusEnum {
  Online,
  Offline
}

/*
  Generated class for the CheckConnectivityProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CheckConnectivityProvider {
  previousStatus;
  constructor(public http: HttpClient, private network: Network, private eventCtrl: Events) {
    this.previousStatus = ConnectionStatusEnum.Online;
  }

  public initializeNetworkEvents(): void {
    this.network.onDisconnect().subscribe(() => {
        if (this.previousStatus === ConnectionStatusEnum.Online) {
            this.eventCtrl.publish('network:offline');
            console.log('disconnected');
        }
        this.previousStatus = ConnectionStatusEnum.Offline;
    });
    this.network.onConnect().subscribe(() => {
        if (this.previousStatus === ConnectionStatusEnum.Offline) {
            this.eventCtrl.publish('network:online');
            console.log('connected');
        }
        this.previousStatus = ConnectionStatusEnum.Online;
    });
}

}
