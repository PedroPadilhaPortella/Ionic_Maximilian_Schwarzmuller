import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
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
        this.navController.navigateBack('/places/tabs/discover');
      }
    })
  }

  onBookPlace() {
    this.navController.navigateBack('/places/tabs/discover');
  }
}
