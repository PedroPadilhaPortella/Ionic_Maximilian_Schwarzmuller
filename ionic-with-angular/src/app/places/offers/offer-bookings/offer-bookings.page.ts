import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../place.model';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss']
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place!: Place;
  private placeSub!: Subscription
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
  ) { }

  ngOnInit() {
    this.getPlaceById();
  }

  ngOnDestroy(): void {
    this.placeSub.unsubscribe();
  }

  getPlaceById() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const placeId = paramMap.get('placeId')!;
      this.placeSub = this.placesService.getPlace(placeId).subscribe((place) => {
        this.place = place!;
      });

      if (!paramMap.has('placeId') || this.place == null) {
        this.navController.navigateBack('/places/tabs/offers');
      }
    })
  }
}
