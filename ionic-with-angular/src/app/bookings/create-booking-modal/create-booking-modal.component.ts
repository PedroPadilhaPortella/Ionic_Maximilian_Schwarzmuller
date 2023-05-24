import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking-modal',
  templateUrl: './create-booking-modal.component.html',
  styleUrls: ['./create-booking-modal.component.scss'],
})
export class CreateBookingModalComponent implements OnInit {

  @Input() selectedPlace!: Place;
  @Input() selectedMode!: 'select' | 'random';

  startDate!: string;
  endDate!: string;

  form!: FormGroup;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    console.warn(this.selectedMode)
    this.createForm();
    this.setDates();
  }

  setDates() {
    const avaliableFrom = new Date(this.selectedPlace.avaliableFrom);
    const avaliableTo = new Date(this.selectedPlace.avaliableTo);

    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        avaliableFrom.getTime() + Math.random()
        * (avaliableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - avaliableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random()
        * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime()
        )).toISOString();
    }
  }

  createForm() {
    this.form = new FormGroup({
      firstName: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      lastName: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      guestNumber: new FormControl(0, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(this.startDate, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(this.endDate, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  bookPlace() {
    if(this.form.valid) {
      this.modalController.dismiss({ ...this.form.value }, 'confirm');
    }
  }

  cancelBook() {
    this.modalController.dismiss(null, 'cancel');
  }

  areDatesValid() {
    const dateFrom = new Date(this.form.value.dateFrom)
    const dateTo = new Date(this.form.value.dateFrom)
    return dateTo > dateFrom;
  }

}