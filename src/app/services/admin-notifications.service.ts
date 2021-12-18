import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { AdminNotifications } from '../models/admin-notifications.model';
import { environment } from '../../environments/environment';

const baseUrl = `${environment.apiURL}/admin-notifications`;

@Injectable({
  providedIn: 'root',
})

export class AdminNotificationsService {
  constructor(private http: HttpClient) {}
  getAll(limit: any, status: any): Observable<AdminNotifications[]> {
    return this.http.get<AdminNotifications[]>(`${baseUrl}?limit=${limit}&status=${status}`);
  }

  get(id: any): Observable<AdminNotifications> {
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
}
