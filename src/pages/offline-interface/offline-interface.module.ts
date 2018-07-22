import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineInterfacePage } from './offline-interface';

@NgModule({
  declarations: [
    OfflineInterfacePage,
  ],
  imports: [
    IonicPageModule.forChild(OfflineInterfacePage),
  ],
})
export class OfflineInterfacePageModule {}
