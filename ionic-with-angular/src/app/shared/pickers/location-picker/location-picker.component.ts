import { ModalController } from '@ionic/angular';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { of, switchMap } from 'rxjs';
import { Coordinates, PlaceLocation } from 'src/app/places/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output('locationPick') locationPick = new EventEmitter<PlaceLocation>();

  selectedLocationImage: string | undefined;
  isLoading = false;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  onPickLocation() {
    this.modalController.create({ component: MapModalComponent })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          this.isLoading = true;
          const pickedLocation: PlaceLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address: '',
            staticMapImage: ''
          }

          this.getAddress(modalData.data as Coordinates)
            .pipe(
              switchMap((address) => {
                pickedLocation.address = address;
                return this.getMapImage(modalData.data as Coordinates, 10)
              })
            ).subscribe((mapImage) => {
              pickedLocation.staticMapImage = mapImage;
              this.selectedLocationImage = mapImage;
              this.isLoading = false;
              this.locationPick.emit(pickedLocation);
            });
        })
        modalEl.present();
      })
  }

  private getAddress(coordinates: Coordinates) {
    return of('endereco');
  }

  private getMapImage(coordinates: Coordinates, zoom: number) {
    return of('https://www.google.com/maps/d/thumbnail?mid=1b7O5v9uTjuzMkbx1svrnPJOVvVE&hl=en');
  }

}
