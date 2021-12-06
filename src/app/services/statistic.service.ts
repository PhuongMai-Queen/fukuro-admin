import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of as observableOf} from 'rxjs';
import { Contacts } from '../models/contacts.model';
import { environment } from '../../environments/environment';

// count rental news
const baseUrlRentalNews = `${environment.apiURL}/statistics/rental-news`;

// count premium bills
const baseUrlPremiumBills = `${environment.apiURL}/statistics/premium-bills`;

// count comments
const baseUrlComments = `${environment.apiURL}/statistics/comments`;

// count customer
const baseUrlCustomer = `${environment.apiURL}/statistics/customers`;

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private http: HttpClient) {}
  countRentalNews(time: any): Observable<Contacts> {
    return this.http.get(`${baseUrlRentalNews}/${time}`);
  }
  countPremiumBill(time: any): Observable<Contacts> {
    return this.http.get(`${baseUrlPremiumBills}/${time}`);
  }
  countComment(time: any): Observable<Contacts> {
    return this.http.get(`${baseUrlComments}/${time}`);
  }
  countCustomer(time: any): Observable<Contacts> {
    return this.http.get(`${baseUrlCustomer}/${time}`);
  }
}
