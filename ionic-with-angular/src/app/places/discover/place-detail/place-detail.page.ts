import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ModalController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingModalComponent } from 'src/app/bookings/create-booking-modal/create-booking-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place!: Place;
  private placeSub!: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
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
        this.navController.navigateBack('/places/tabs/discover');
      }
    })
  }

  onBookPlace() {
    this.actionSheetController.create({
      header: 'Choose an action',
      buttons: [
        { text: 'Select Date', handler: () => this.openBookingModal('select') },
        { text: 'Random Date', handler: () => this.openBookingModal('random') },
        { text: 'Cancel', role: 'cancel' },
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    })
  }

  openBookingModal(mode: 'select' | 'random') {
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
