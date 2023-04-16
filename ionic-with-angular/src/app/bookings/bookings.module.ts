import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BookingsPageRoutingModule } from './bookings.page.routing.module';
import { BookingsPage } from './bookings.page';

@NgModule({
  declarations: [
    BookingsPage
  ],
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    BookingsPageRoutingModule,
  ]
})
export class BookingsPageModule { }