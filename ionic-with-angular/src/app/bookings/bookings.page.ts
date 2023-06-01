import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  bookings!: Booking[];
  isLoading = false;
  private bookingsSub!: Subscription

  constructor(
    private bookingService: BookingService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.bookingsSub = this.bookingService.bookings.subscribe((bookings) => {
      this.bookings = bookings;
    })
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

  cancelBooking(bookingId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    this.loadingController.create({ message: 'Cancelling Booking...' })
      .then(loadingEl => {
        loadingEl.present();
        this.bookingService.cancelBooking(bookingId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
