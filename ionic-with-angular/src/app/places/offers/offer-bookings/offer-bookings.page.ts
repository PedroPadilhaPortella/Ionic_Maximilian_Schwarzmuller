import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../place.model';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss']
})
export class OfferBookingsPage implements OnInit {
  place!: Place;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
  ) { }

  ngOnInit() {
    this.getPlaceById();
  }

  getPlaceById() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const placeId = paramMap.get('placeId')!;
      this.place = this.placesService.getPlace(placeId)!;

      if (!paramMap.has('placeId') || this.place == null) {
        this.navController.navigateBack('/places/tabs/offers');
      }
    })
  }
}
