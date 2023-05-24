import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingModalComponent } from 'src/app/bookings/create-booking-modal/create-booking-modal.component';
import { Subscription } from 'rxjs';
import { BookingService } from 'src/app/bookings/booking.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place!: Place;
  isBookable: boolean = false
  private placeSub!: Subscription

  constructor(
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private bookingService: BookingService,
    private placesService: PlacesService,
    private navController: NavController,
    private authService: AuthService,
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
      this.isBookable = this.place.userId !== this.authService.userId
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
      componentProps: { selectedPlace: this.place, selectedMode: mode },
    }).then((modalEl) => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then((result) => {
      if (result.role === 'confirm') {
        this.loadingController.create({ message: 'Booking place...' })
          .then(loadingEl => {
            loadingEl.present();
            this.bookingService.addBooking(
              this.place.id,
              this.place.title,
              this.place.imageUrl,
              result.data.firstName,
              result.data.lastName,
              result.data.guestNumber,
              result.data.dateFrom,
              result.data.dateTo,
            ).subscribe(() => {
              loadingEl.dismiss();
            });
          });
      }
    });
  }
}
