import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonicModule, Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],  
  standalone: true,
  imports: [
    IonicModule,
    RouterModule
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  
  authSub!: Subscription;
  previousAuthState = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
    })
  }

  ngOnInit(): void {
    this.authSub = this.authService.userIsAuthenticated.subscribe((isAuthenticated) => {
      if(!isAuthenticated && this.previousAuthState !== isAuthenticated) {
        this.router.navigateByUrl('/auth');
      }

      this.previousAuthState = isAuthenticated;
    })
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if(this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
