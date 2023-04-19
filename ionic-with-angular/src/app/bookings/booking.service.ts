import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  get bookings() {
    return [...this._bookings];
  }

  constructor() { }

  getBook(id: string) {
    return this._bookings.find(booking => booking.id === id);
  }

  private _bookings: Booking[] = [
    {
      id: '1',
      placeId: '1',
      userId: '1',
      guestNumber: 1,
      placeTitle: 'Praga'
    },
    {
      id: '2',
      placeId: '2',
      userId: '2',
      guestNumber: 2,
      placeTitle: 'Bratislava'
    },
    {
      id: '3',
      placeId: '3',
      userId: '3',
      guestNumber: 3,
      placeTitle: 'Berlim'
    }
  ]
}
