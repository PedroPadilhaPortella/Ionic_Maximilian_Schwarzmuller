import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking-modal',
  templateUrl: './create-booking-modal.component.html',
  styleUrls: ['./create-booking-modal.component.scss'],
})
export class CreateBookingModalComponent  implements OnInit {

  @Input() selectedPlace!: Place;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  bookPlace() {
    this.modalController.dismiss({ selectedPlace: this.selectedPlace }, 'confirm');
  }

  cancelBook() {
    this.modalController.dismiss(null, 'cancel');
  }

}
