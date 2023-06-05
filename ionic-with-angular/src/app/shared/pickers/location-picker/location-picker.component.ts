import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { of, switchMap } from 'rxjs';
import { Coordinates, PlaceLocation } from 'src/app/places/location.model';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output('locationPick') locationPick = new EventEmitter<PlaceLocation>();

  selectedLocationImage: string | undefined = '';
  isLoading = false;

  constructor(
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private alertController: AlertController,
  ) { }

  ngOnInit() { }

  onPickLocation() {
    this.actionSheetController.create({
      header: 'Please Choose',
      buttons: [
        { text: 'Use my location', handler: () => this.getUserLocation() },
        { text: 'Pick on map', handler: () => this.openMap() },
        { text: 'Cancel', role: 'cancel' },
      ]
    }).then((actionSheetEl) => {
      actionSheetEl.present();
    })
  }

  private getUserLocation() {
    if (Capacitor.isPluginAvailable('Geolocation')) {
      this.isLoading = true;
      Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        const coordinates: Coordinates = {
            lat: geoPosition.coords.latitude,
            lng: geoPosition.coords.longitude
          };
          this.fetchPlace(coordinates.lat, coordinates.lng);
          this.isLoading = false;
        }).catch((error) => {
          this.showErrorAlert();
        })
    } else {
      this.showErrorAlert();
    }
  }

  private openMap() {
    this.modalController.create({ component: MapModalComponent })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng
          };
          this.fetchPlace(coordinates.lat, coordinates.lng);
        })
        modalEl.present();
      })
  }

  private fetchPlace(lat: number, lng: number) {
    this.isLoading = true;
    const pickedLocation: PlaceLocation = { lat, lng, address: '', staticMapImage: '' }

    this.getAddress({ lat, lng } as Coordinates)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address;
          return this.getMapImage({ lat, lng } as Coordinates, 10)
        })
      ).subscribe((mapImage) => {
        pickedLocation.staticMapImage = mapImage;
        this.selectedLocationImage = mapImage;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress(coordinates: Coordinates) {
    return of('Unknow address');
  }

  private getMapImage(coordinates: Coordinates, zoom: number) {
    return of('https://www.google.com/maps/d/thumbnail?mid=1b7O5v9uTjuzMkbx1svrnPJOVvVE&hl=en');
  }

  private showErrorAlert() {
    this.alertController.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location.',
      buttons: ['Ok'],
    })
  }
}
