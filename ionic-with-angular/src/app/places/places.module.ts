import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateBookingModalComponent } from '../bookings/create-booking-modal/create-booking-modal.component';
import { DiscoverPage } from './discover/discover.page';
import { PlaceDetailPage } from './discover/place-detail/place-detail.page';
import { EditOfferPage } from './offers/edit-offer/edit-offer.page';
import { NewOfferPage } from './offers/new-offer/new-offer.page';
import { OfferItemComponent } from './offers/offer-item/offer-item.component';
import { OffersPage } from './offers/offers.page';
import { PlacesPage } from './places.page';
import { PlacesPageRoutingModule } from './places.page.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PlacesPage,
    DiscoverPage,
    PlaceDetailPage,
    OffersPage,
    NewOfferPage,
    EditOfferPage,
    CreateBookingModalComponent,
    OfferItemComponent,
  ],
  imports: [
    IonicModule, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PlacesPageRoutingModule,
    SharedModule,
  ],
  entryComponents: [CreateBookingModalComponent]
})
export class PlacesPageModule { }
