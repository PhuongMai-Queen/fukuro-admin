import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admins } from '../models/admins.model';

const baseUrl = 'http://localhost:8000/api/admins';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  constructor(private http: HttpClient) {}
  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/login`, data);
  }
  getAll(): Observable<Admins[]> {
    return this.http.get<Admins[]>(baseUrl);
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
}
