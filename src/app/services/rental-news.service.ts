import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RentalNews } from '../models/rental-news.model';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiURL+'/rental-news';

@Injectable({
  providedIn: 'root',
})
export class RentalNewsService {
  constructor(private http: HttpClient) {}
  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/login`, data);
  }
  getAll(): Observable<RentalNews[]> {
    return this.http.get<RentalNews[]>(baseUrl);
  }

  get(id: any): Observable<RentalNews> {
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

  findByTitle(title: any): Observable<RentalNews[]> {
    return this.http.get<RentalNews[]>(`${baseUrl}?title=${title}`);
  }
}
