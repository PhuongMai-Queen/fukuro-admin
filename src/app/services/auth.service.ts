import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {

  isLoggedIn?: boolean;
  constructor( private _router: Router ) {  }

  loggedIn() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = token ? true : false;
    return this.isLoggedIn;
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('timer');
    this._router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

}
