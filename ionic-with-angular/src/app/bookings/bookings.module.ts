import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BookingsPage } from './bookings.page';
import { BookingsPageRoutingModule } from './bookings.page.routing.module';

@NgModule({
  declarations: [
    BookingsPage,
  ],
  imports: [
    IonicModule, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BookingsPageRoutingModule,
  ]
})
export class BookingsPageModule { }
