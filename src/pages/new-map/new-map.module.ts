import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewMapPage } from './new-map';

@NgModule({
  declarations: [
    NewMapPage,
  ],
  imports: [
    IonicPageModule.forChild(NewMapPage),
  ],
})
export class NewMapPageModule {}
