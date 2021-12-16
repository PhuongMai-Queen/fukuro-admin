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

// count question by categories
const baseUrlQuestion = `${environment.apiURL}/statistics/question-categories`;

// count question by categories
const baseIncome = `${environment.apiURL}/statistics/income`;

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private http: HttpClient) {}
  countRentalNews(start: any, end: any): Observable<Contacts> {
    return this.http.get(`${baseUrlRentalNews}?start=${start}&end=${end}`);
  }
  countPremiumBill(start: any, end: any): Observable<Contacts> {
    return this.http.get(`${baseUrlPremiumBills}?start=${start}&end=${end}`);
  }
  countComment(start: any, end: any): Observable<Contacts> {
    return this.http.get(`${baseUrlComments}?start=${start}&end=${end}`);
  }
  countCustomer(start: any, end: any): Observable<Contacts> {
    return this.http.get(`${baseUrlCustomer}?start=${start}&end=${end}`);
  }
  countQuestionByCategories(start: any, end: any): Observable<Contacts> {
    return this.http.get(`${baseUrlQuestion}?start=${start}&end=${end}`);
  }
  countIncomeByDate(start: any, end: any): Observable<Contacts> {
    return this.http.get(`${baseIncome}?start=${start}&end=${end}`);
  }
}
