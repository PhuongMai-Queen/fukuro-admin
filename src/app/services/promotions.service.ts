import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotions } from '../models/promotions.model';

const baseUrl = 'http://localhost:8000/api/promotions';

@Injectable({
  providedIn: 'root',
})
export class PromotionsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotions[]> {
    return this.http.get<Promotions[]>(baseUrl);
  }

  get(id: any): Observable<Promotions> {
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

  findByTitle(title: any): Observable<Promotions[]> {
    return this.http.get<Promotions[]>(`${baseUrl}?title=${title}`);
  }
}