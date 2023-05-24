import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss']
})
export class NewOfferPage implements OnInit {

  form!: FormGroup;

  constructor(
    private router: Router,
    private placesService: PlacesService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  createOffer() {
    if (this.form.valid) {
      this.loadingCtrl.create({ message: 'Creating Place' })
        .then(loadingEl => {
          loadingEl.present();

          this.placesService.addPlace(
            this.form.value.title,
            this.form.value.description,
            Number(this.form.value.price),
            new Date(this.form.value.dateFrom),
            new Date(this.form.value.dateTo)
          ).subscribe(() => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/offers');
          });
        });
    }
  }
}
