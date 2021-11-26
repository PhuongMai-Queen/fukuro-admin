import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customers } from '../models/customers.model';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiURL+'/customers';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private http: HttpClient) {}

  getAll(limit: any): Observable<Customers[]> {
    return this.http.get<Customers[]>(`${baseUrl}?limit=${limit}&status=both`);
  }

  get(id: any): Observable<Customers> {
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

  findByTitle(title: any): Observable<Customers[]> {
    return this.http.get<Customers[]>(`${baseUrl}?title=${title}`);
  }
}
