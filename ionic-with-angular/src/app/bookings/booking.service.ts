import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { PRAGA_IMG } from 'src/assets/praga';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private _bookings = new BehaviorSubject<Booking[]>(
    [
      {
        id: '1',
        placeId: '3',
        userId: '1',
        guestNumber: 1,
        placeTitle: 'Praga',
        bookedFrom: new Date(),
        bookedTo: new Date(),
        firstName: 'Pedro',
        lastName: 'Cruz',
        placeImage: PRAGA_IMG
      }
    ]
  );

  get bookings(): Observable<Booking[]>  {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService) { }

  getBook(id: string) {
    return this._bookings
      .pipe(
        take(1),
        map(bookings => bookings.find(booking => booking.id === id))
      )
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firtName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date,
  ) {
    const booking = new Booking(
      Math.random().toString(), placeId,
      this.authService.userId,
      placeTitle,
      placeImage,
      firtName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    return this.bookings
      .pipe(
        take(1),
        delay(1000),
        tap(bookings => {
          this._bookings.next(bookings.concat(booking));
        }),
      );
  }

  cancelBooking(bookingId: string) {
    return this.bookings
      .pipe(
        take(1),
        delay(1000),
        tap(bookings => {
          this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
        }),
      );
  }
}
