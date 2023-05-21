import { Component, OnInit, OnDestroy } from '@angular/core';
import { Place } from '../../place.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  place!: Place;
  form!: FormGroup;
  private placeSub!: Subscription

  constructor(
    private activatedRoute: ActivatedRoute,
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
    this.activatedRoute.paramMap.subscribe(paramMap => {
      const placeId = paramMap.get('placeId')!;
      this.placeSub = this.placesService.getPlace(placeId).subscribe((place) => {
        this.place = place!;
      });

      if (!paramMap.has('placeId') || this.place == null) {
        this.navController.navigateBack(`/places/tabs/offers/${placeId}`);
      }

      this.form.controls['title'].setValue(this.place.title);
      this.form.controls['description'].setValue(this.place.description);
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
      this.router.navigateByUrl('/places/tabs/offers');
    }
  }
}
