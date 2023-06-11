import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { AuthResponse } from './auth.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) { }

  ngOnInit() { }

  switchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  submit(authForm: NgForm) {
    if (authForm.valid) {
      const { email, password } = authForm.value
      this.authenticate(email, password);
      authForm.reset();
    }
  }

  authenticate(email: string, password: string) {
    this.loadingController.create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEl) => {
        loadingEl.present();

        let authObs: Observable<AuthResponse>

        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.register(email, password);
        }

        authObs.subscribe({
          next: () => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          error: (response) => {
            loadingEl.dismiss();
            this.showAlert(response.error.error.message);
          },
        });
      });
  }

  showAlert(message: string) {
    this.alertController.create({
      header: 'Authenticaion failed!',
      message: message,
      buttons: ['Okay']
    }).then((alertEl) => {
      alertEl.present();
    })
  }
}
