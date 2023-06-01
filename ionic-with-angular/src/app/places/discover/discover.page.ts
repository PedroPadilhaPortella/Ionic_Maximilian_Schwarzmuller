import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {

  allPlaces!: Place[];
  places!: Place[];
  userId!: string;
  isLoading = false;
  private filter = 'all';
  private placesSub!: Subscription

  constructor(
    private placesService: PlacesService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.userId = this.authService.userId
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.allPlaces = places;
      this.places = places;
      this.filterUpdate(this.filter);
    })
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if(this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onFilterUpdate(event: any) {
    this.filterUpdate(event.detail.value);
  }

  filterUpdate(filter: string) {
    const isShown = (place: Place) => filter === 'all' || place.userId !== this.authService.userId;
    this.places = this.allPlaces.filter(isShown);
    this.filter = filter;
  }
}
