import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiscoverPage } from './discover/discover.page';
import { PlaceDetailPage } from './discover/place-detail/place-detail.page';
import { EditOfferPage } from './offers/edit-offer/edit-offer.page';
import { NewOfferPage } from './offers/new-offer/new-offer.page';
import { OffersPage } from './offers/offers.page';
import { PlacesPage } from './places.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
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
          }
        ]
      },
      {
        path: '',
        redirectTo: '/places/tabs/discover',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/places/tabs/discover',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlacesPageRoutingModule { }