import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse } from './auth.model';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { User } from './user.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private FIREBASE_AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private _user = new BehaviorSubject<User | null>(null);
  private activeLogoutTimer: any;

  get userId(): Observable<string | null> {
    return this._user!.asObservable()
      .pipe(
        map((user) => user?.id ?? null)
      );
  }

  get userIsAuthenticated(): Observable<boolean> {
    return this._user!.asObservable()
      .pipe(
        map((user) => !!user?.token ?? false)
      );
  }

  get token() {
    return this._user!.asObservable()
    .pipe(
      map((user) => user?.token ?? null)
    );
  }

  constructor(
    private http: HttpClient,
  ) { }

  register(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(`${this.FIREBASE_AUTH_URL}:signUp?key=${environment.apiKey}`, body)
      .pipe(
        tap(this.setUser.bind(this))
      )
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const body = { email, password, returnSecureToken: true };
    return this.http
      .post<AuthResponse>(`${this.FIREBASE_AUTH_URL}:signInWithPassword?key=${environment.apiKey}`, body)
      .pipe(
        tap(this.setUser.bind(this))
      )
  }

  logout() {
    this.preventTimeoutMemoryLeaks();
    this._user.next(null);
    Preferences.remove({ key: 'authData' })
  }

  autoLogin(): Observable<boolean> {
    return from(Preferences.get({ key: 'authData' }))
      .pipe(map((authData) => {
        if (authData && authData.value) {
          const storeData = JSON.parse(authData.value);
          const expirationTime = new Date(storeData.tokenExpirationDate);
          if (expirationTime >= new Date()) {
            return new User(storeData.id, storeData.email, storeData._token, expirationTime);
          }

        }
        return null;
      }),
        tap((user) => {
          if (user) {
            this._user.next(user);
            this.scheduleAutoLogout(user.tokenDuration);
          }
        }),
        map((user) => !!user)
      );
  }

  scheduleAutoLogout(duration: number) {
    this.preventTimeoutMemoryLeaks();
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUser(userResponse: AuthResponse): void {
    const expirationTime = new Date(new Date().getTime() + (Number(userResponse.expiresIn) * 1000));
    const user = new User(
      userResponse.localId,
      userResponse.email,
      userResponse.idToken,
      expirationTime
    );
    this._user.next(user)
    this.scheduleAutoLogout(user.tokenDuration);
    this.storeAuthData(user);
  }

  private storeAuthData(user: User) {
    const authData = JSON.stringify({ ...user, tokenExpirationDate: user.tokenExpirationDate.toISOString() })
    Preferences.set({ key: 'authData', value: authData })
  }

  private preventTimeoutMemoryLeaks() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

  ngOnDestroy(): void {
    this.preventTimeoutMemoryLeaks();
  }
}
