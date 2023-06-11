import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

type BookingResponse = Omit<Booking, "id">;

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  FIREBASE_URL = 'https://ionic-angular-8de26-default-rtdb.firebaseio.com';

  private _bookings = new BehaviorSubject<Booking[]>([]);

  get bookings(): Observable<Booking[]> {
    return this._bookings.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchBookings(): Observable<Booking[]> {
    let genToken: string;

    return this.authService.token
      .pipe(
        take(1),
        switchMap((token) => {
          genToken = token!;
          return this.authService.userId;
        }),
        take(1),
        switchMap((userId) => {
          if (userId) {
            return this.http.get<{ [key: string]: BookingResponse }>
              (`${this.FIREBASE_URL}/bookings.json?orderBy="userId"&equalTo="${userId}"&auth=${genToken}`)
          } else {
            throw new Error('No user Id found.');
          }
        }),
        map((response) => {
          const bookings = []
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              bookings.push(new Booking(key,
                response[key].placeId,
                response[key].userId,
                response[key].placeTitle,
                response[key].placeImage,
                response[key].firstName,
                response[key].lastName,
                response[key].guestNumber,
                new Date(response[key].bookedFrom),
                new Date(response[key].bookedTo),
              ))
            }
          }
          return bookings;
        }),
        tap(bookings => {
          this._bookings.next(bookings);
        }),
      )
  }

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
    dateTo: Date
  ) {
    let generatedId: string;
    let booking: Booking;
    let genToken: string;

    return this.authService.token
      .pipe(
        take(1),
        switchMap((token) => {
          genToken = token!;
          return this.authService.userId;
        }),
        take(1),
        switchMap((userId) => {
          if (userId) {
            booking = new Booking(
              Math.random().toString(), placeId,
              userId,
              placeTitle,
              placeImage,
              firtName,
              lastName,
              guestNumber,
              dateFrom,
              dateTo
            );

            return this.http.post<{ name: string }>(
              `${this.FIREBASE_URL}/bookings.json?auth=${genToken}`, { ...booking, id: null }
            )
          } else {
            throw new Error('No user Id found.');
          }
        }),
        switchMap((response) => {
          generatedId = response.name;
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          booking.id = generatedId;
          return this._bookings.next(bookings.concat(booking));
        })
      )
  }

  cancelBooking(bookingId: string) {
    return this.authService.token
      .pipe(
        take(1),
        switchMap((token) => {
          return this.http.delete(`${this.FIREBASE_URL}/bookings/${bookingId}.json?auth=${token}`)
        }),
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookings => {
          this._bookings.next(bookings.filter(booking => booking.id !== bookingId));
        })
      );
  }
}
