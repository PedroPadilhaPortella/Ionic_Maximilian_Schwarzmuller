import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
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
  ) { }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
