import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashNewPage } from './splash-new';

@NgModule({
  declarations: [
    SplashNewPage,
  ],
  imports: [
    IonicPageModule.forChild(SplashNewPage),
  ],
})
export class SplashNewPageModule {}
