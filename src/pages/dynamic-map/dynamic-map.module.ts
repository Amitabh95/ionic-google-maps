import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DynamicMapPage } from './dynamic-map';

@NgModule({
  declarations: [
    DynamicMapPage,
  ],
  imports: [
    IonicPageModule.forChild(DynamicMapPage),
  ],
})
export class DynamicMapPageModule {}
