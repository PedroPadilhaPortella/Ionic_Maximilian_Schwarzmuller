import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacesPage } from './places.page';
import { OffersPage } from './offers/offers.page';
import { DiscoverPage } from './discover/discover.page';
import { PlaceDetailPage } from './discover/place-detail/place-detail.page';
import { NewOfferPage } from './offers/new-offer/new-offer.page';
import { EditOfferPage } from './offers/edit-offer/edit-offer.page';
import { OfferBookingsPage } from './offers/offer-bookings/offer-bookings.page';

export const routes: Routes = [
  {
    path: '',
    component: PlacesPage,
  },
  {
    path: 'discover',
    children: [
      {
        path: '',
        component: DiscoverPage,
      },
      {
        path: ':placeId',
        component: PlaceDetailPage,
      }
    ]
  },
  {
    path: 'offers',
    children: [
      {
        path: '',
        component: OffersPage,
      },
      {
        path: 'new',
        component: NewOfferPage,
      },
      {
        path: 'edit/:placeId',
        component: EditOfferPage,
      },
      {
        path: ':placeId',
        component: OfferBookingsPage,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesPageRoutingModule { }