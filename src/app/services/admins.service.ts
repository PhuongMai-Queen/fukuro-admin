import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { Admins } from '../models/admins.model';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiURL+'/admins';
const changePassUrl = environment.apiURL+'/password-resets';

@Injectable({
  providedIn: 'root',
})

export class AdminsService {
  profileImageUpdate$ = new Subject<string>();
  profileName$ = new Subject<string>();
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/login`, data);
  }
  getAll(limit: any): Observable<Admins[]> {
    return this.http.get<Admins[]>(`${baseUrl}?limit=${limit}&status=both`);
  }

  get(id: any): Observable<Admins> {
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

  findByTitle(title: any): Observable<Admins[]> {
    return this.http.get<Admins[]>(`${baseUrl}?title=${title}`);
  }

  updatePassword(id: any, data: any): Observable<any> {
    return this.http.put(`${changePassUrl}/${id}`, data);
  }
}
