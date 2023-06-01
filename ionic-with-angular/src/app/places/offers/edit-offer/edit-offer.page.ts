import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  placeId!: string
  place!: Place;
  form!: FormGroup;
  isLoading = false;
  private placeSub!: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private LoadingCtrl: LoadingController,
    private navController: NavController,
    private placesService: PlacesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.getPlaceById();
  }

  ngOnDestroy(): void {
    this.placeSub.unsubscribe();
  }

  getPlaceById() {
    this.isLoading = true;

    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.placeId = paramMap.get('placeId')!;

      this.placeSub = this.placesService.getPlace(this.placeId).subscribe((place) => {
        this.place = place!;

        if (!paramMap.has('placeId') || this.place == null) {
          this.navController.navigateBack(`/places/tabs/offers/${this.placeId}`);
        }
  
        this.form.controls['title'].setValue(this.place.title);
        this.form.controls['description'].setValue(this.place.description);

        this.isLoading = false;
      }, (error) => {
        this.alertController.create({ 
          header: 'An error ocurred!', 
          message: 'Place could not be fetched. please try again later.',
          buttons: [{ text: 'Okay', handler: () => this.router.navigate(['/places/tabs/offers'])}]
        }).then((alertEl) => {
          alertEl.present();
        })
      });
    })
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
      })
    });
  }

  updateOffer() {
    if (this.form.valid) {
      this.LoadingCtrl.create({ message: 'Updating Place' })
      .then(loadingEl => {
        loadingEl.present();
        this.placesService.updatePlace(
          this.place.id, 
          this.form.value.title, 
          this.form.value.description
        ).subscribe(() => {
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/offers');
        });
      })
    }
  }
}
