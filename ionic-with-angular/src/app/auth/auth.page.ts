import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';

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
  ) { }

  ngOnInit() {
  }

  switchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  submit(authForm: NgForm) {
    if (authForm.valid) {
      const { email, password } = authForm.value

      if (this.isLogin) {
        this.login(email, password);
      } else {
        this.signUp(email, password);
      }
    }
  }

  login(email: string, password: string) {
    this.authService.login();
    this.loadingController.create({ keyboardClose: true, message: 'Loading' }).then((loadingEl) => {
      loadingEl.present();
      setTimeout(() => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, 1000);
    });
  }

  signUp(email: string, password: string) {
    this.authService.login();
    this.loadingController.create({ keyboardClose: true, message: 'Loading' }).then((loadingEl) => {
      loadingEl.present();
      setTimeout(() => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, 1000);
    });
  }
}
