import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonicModule, Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';

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
export class AppComponent {
  
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

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
