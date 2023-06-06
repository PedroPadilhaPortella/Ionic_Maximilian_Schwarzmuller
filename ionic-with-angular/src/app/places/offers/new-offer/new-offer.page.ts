import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';
import { base64toBlob, formatImage } from '../../../utils/utils';

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
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
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
      location: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      image: new FormControl(null),
      imageUrl: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  locationPick(placeLocation: PlaceLocation) {
    this.form.patchValue({ location: placeLocation })
  }

  imagePick(imageData: string | File) {
    let imageFile: any
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(formatImage(imageData), 'image/jpeg')
      } catch (error) {
        console.error(error)
        this.showErrorAlert();
      }
    } else {
      imageFile = imageData;
    }
    
    this.form.patchValue({ image: imageFile });
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
            new Date(this.form.value.dateTo),
            this.form.value.location,
            this.form.value.imageUrl,
          ).subscribe(() => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/offers');
          });
        });
    }
  }

  private showErrorAlert() {
    this.alertController.create({
      header: 'Could not get the image',
      buttons: ['Ok'],
    }).then((alertEl) => {
      alertEl.present();
    })
  }
}
