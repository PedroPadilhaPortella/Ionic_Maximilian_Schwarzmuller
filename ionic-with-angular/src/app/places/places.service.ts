import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';
import { DEFAULT_PLACE_IMG } from 'src/assets/default_place';
import { PRAGA_IMG } from 'src/assets/praga';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

type PlaceResponse = Omit<Place, "id">;

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  FIREBASE_URL = 'https://ionic-angular-8de26-default-rtdb.firebaseio.com'

  private _places = new BehaviorSubject<Place[]>([]);

  get places(): Observable<Place[]> {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceResponse }>(`${this.FIREBASE_URL}/oferred-places.json`)
      .pipe(
        map((response) => {
          const places = []
          for (const key in response) {
            if (response.hasOwnProperty(key)) {
              places.push(new Place(key,
                response[key].title,
                response[key].description,
                response[key].imageUrl,
                response[key].price,
                response[key].avaliableFrom,
                response[key].avaliableTo,
                response[key].userId
              ))
            }
          }
          return places;
        }),
        tap(places => {
          this._places.next(places);
        }),
      )
  }

  getPlace(id: string): Observable<Place> {
    return this.http.get<PlaceResponse>(`${this.FIREBASE_URL}/oferred-places/${id}.json`)
      .pipe(
        map((response) => {
          return new Place(
            id,
            response.title,
            response.description,
            response.imageUrl,
            response.price,
            new Date(response.avaliableFrom),
            new Date(response.avaliableTo),
            response.userId
          );
        })
      );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
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

    return this.http.post<{ name: string }>(
      `${this.FIREBASE_URL}/oferred-places.json`, { ...place, id: null }
    )
      .pipe(
        switchMap((response) => {
          generatedId = response.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          place.id = generatedId;
          return this._places.next(places.concat(place));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatePlaces: Place[]
    return this.places
      .pipe(
        take(1),
        switchMap((places) => {
          if (!places || places.length == 0) {
            return this.fetchPlaces();
          } else {
            return of(places);
          }
        }),
        switchMap((places) => {
          const updatePlaceIndex = places.findIndex(place => place.id == placeId);
          updatePlaces = [...places];
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

          return this.http.put(
            `${this.FIREBASE_URL}/oferred-places/${placeId}.json`,
            { ...updatePlaces[updatePlaceIndex], id: null }
          )
        }),
        tap(() => {
          return this._places.next(updatePlaces);
        }),
      );
  }
}
