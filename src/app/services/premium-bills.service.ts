import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PremiumBills } from '../models/premium-bills.model';
import { environment } from '../../environments/environment';

const baseUrl = `${environment.apiURL}/premium-bills`;

@Injectable({
  providedIn: 'root',
})
export class PremiumBillsService {
  constructor(private http: HttpClient) {}
  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/login`, data);
  }
  getAll(limit: any): Observable<PremiumBills[]> {
    return this.http.get<PremiumBills[]>(`${baseUrl}?status=both&limit=${limit}&orderby=desc`);
  }

  get(id: any): Observable<PremiumBills> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByTitle(title: any): Observable<PremiumBills[]> {
    return this.http.get<PremiumBills[]>(`${baseUrl}?title=${title}`);
  }
}
