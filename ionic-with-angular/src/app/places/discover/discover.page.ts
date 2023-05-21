import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss']
})
export class DiscoverPage implements OnInit, OnDestroy {

  places!: Place[];
  private placesSub!: Subscription

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe((places) => {
      this.places = places;
    })
  }

  ngOnDestroy(): void {
    if(this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  filterUpdate(event: any) {
    console.log(event.detail)
  }

}
