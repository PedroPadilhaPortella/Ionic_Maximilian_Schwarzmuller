import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { DEFAULT_PLACE_IMG } from 'src/assets/default_place';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { PlaceLocation } from './location.model';

type PlaceResponse = Omit<Place, "id">;

interface UploadImage {
  imageUrl: string;
  imagePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  FIREBASE_URL = 'https://ionic-angular-8de26-default-rtdb.firebaseio.com';

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
                response[key].userId,
                response[key].location
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
            response.userId,
            response.location
          );
        })
      );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let place: Place;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (userId) {
          place = new Place(
            Math.random().toString(),
            title,
            description,
            imageUrl,
            price,
            dateFrom,
            dateTo,
            userId,
            location
          );

          return this.http.post<{ name: string }>(
            `${this.FIREBASE_URL}/oferred-places.json`, { ...place, id: null }
          )
        } else {
          throw new Error('No user Id found.');
        }
      }),
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
            oldPlace.location
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
