import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {

  isLoggedIn?: boolean;
  constructor( private _router: Router ) {  }

  loggedIn() {
    const token = localStorage.getItem('tokenAdmin');
    this.isLoggedIn = token ? true : false;
    return this.isLoggedIn;
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('id');
    localStorage.removeItem('tokenAdmin');
    localStorage.removeItem('timerAdmin');
    this._router.navigate(['/auth/login']);
  }

  getToken() {
    return localStorage.getItem('tokenAdmin');
  }

}
