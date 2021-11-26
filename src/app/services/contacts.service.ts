import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacts } from '../models/contacts.model';
import { environment } from '../../environments/environment';

const baseUrl = `${environment.apiURL}/admin-contacts`;

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private http: HttpClient) {}
  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/login`, data);
  }
  getAll(limit: any): Observable<Contacts[]> {
    return this.http.get<Contacts[]>(`${baseUrl}?limit=${limit}`);
  }

  get(id: any): Observable<Contacts> {
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

  findByTitle(title: any): Observable<Contacts[]> {
    return this.http.get<Contacts[]>(`${baseUrl}?title=${title}`);
  }
}
