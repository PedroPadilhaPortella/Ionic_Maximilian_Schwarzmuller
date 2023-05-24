import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';
import { DEFAULT_PLACE_IMG } from 'src/assets/default_place';
import { PRAGA_IMG } from 'src/assets/praga';
import { Booking } from '../bookings/booking.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  get places(): Observable<Place[]> {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService) { }

  getPlace(id: string) {
    return this.places
      .pipe(
        take(1),
        map(places => places.find(place => place.id == id))
      )
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const place = new Place(
      Math.random().toString(),
      title,
      description,
      DEFAULT_PLACE_IMG,
      price,
      dateFrom,
      dateTo,
      this.authService.userId,
    );

    return this.places
      .pipe(
        take(1),
        delay(1000),
        tap(places => {
          this._places.next(places.concat(place));
        }),
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places
      .pipe(
        take(1),
        delay(1000),
        tap(places => {
          const updatePlaceIndex = places.findIndex(place => place.id == placeId);
          const updatePlaces = [...places];
          const oldPlace = updatePlaces[updatePlaceIndex]
          updatePlaces[updatePlaceIndex] = new Place(
            oldPlace.id,
            title,
            description,
            oldPlace.imageUrl,
            oldPlace.price,
            oldPlace.avaliableFrom,
            oldPlace.avaliableTo,
            oldPlace.userId,
          );
          this._places.next(updatePlaces);
        }),
      );
  }

  private _places = new BehaviorSubject<Place[]>([
    {
      id: '1',
      title: 'Bratislava',
      description: 'Bratislava',
      price: 18,
      imageUrl: 'https://www.viajoteca.com/wp-content/uploads/2014/09/Bratislava-Por-RastoS1.jpg',
      avaliableFrom: new Date('2021-01-01'),
      avaliableTo: new Date('2021-01-02'),
      userId: '2',
    },
    {
      id: '2',
      title: 'São Paulo',
      description: 'São Paulo',
      price: 12,
      imageUrl: 'https://www.visitbrasil.com/wp-content/uploads/2021/08/Sao-Paulo-SP-Visit-Brasil-7-1-1024x683.jpg',
      avaliableFrom: new Date('2021-01-01'),
      avaliableTo: new Date('2021-01-02'),
      userId: '1',
    },
    {
      id: '3',
      title: 'Praga',
      description: 'Praga',
      price: 20,
      imageUrl: PRAGA_IMG,
      avaliableFrom: new Date('2021-01-01'),
      avaliableTo: new Date('2021-01-02'),
      userId: '2',
    }
  ]);
}
