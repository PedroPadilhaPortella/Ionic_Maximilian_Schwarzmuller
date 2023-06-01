import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  
  places!: Place[];
  isLoading = false;
  private placesSub!: Subscription

  constructor(
    private placesService: PlacesService, 
    private router: Router,
  ) { }

  
  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.places = places;
    })
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if(this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  book(placeId: string, slidingOffer: IonItemSliding) {
    slidingOffer.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', placeId]);
  }

  edit(placeId: string, slidingOffer: IonItemSliding) {
    slidingOffer.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', placeId]);
  }
}
