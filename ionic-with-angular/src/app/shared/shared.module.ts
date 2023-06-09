import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';

@NgModule({
  declarations: [
    LocationPickerComponent,
    ImagePickerComponent,
    MapModalComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    LocationPickerComponent,
    ImagePickerComponent,
    MapModalComponent,
  ],
  entryComponents: [MapModalComponent]
})
export class SharedModule { }
