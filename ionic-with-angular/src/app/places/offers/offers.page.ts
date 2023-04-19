import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
  
  places!: Place[];

  constructor(
    private placesService: PlacesService, 
    private router: Router,
  ) { }

  ngOnInit() {
    this.places = this.placesService.places
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
