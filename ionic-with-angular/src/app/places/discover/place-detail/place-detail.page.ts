import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingModalComponent } from 'src/app/bookings/create-booking-modal/create-booking-modal.component';

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
    private modalController: ModalController,
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
    this.modalController.create({
      component: CreateBookingModalComponent,
      componentProps: { selectedPlace: this.place },
    }).then((modalEl) => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then((resultData) => {
      console.log(resultData.data, resultData.role)
    });
  }
}
