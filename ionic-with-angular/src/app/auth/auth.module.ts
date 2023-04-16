import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthPage } from './auth.page';
import { AuthPageRoutingModule } from './auth.page.routing.module';


@NgModule({
  declarations: [
    AuthPage
  ],
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    AuthPageRoutingModule,
  ]
})
export class AuthPageModule { }
