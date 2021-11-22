import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Premiums } from '../models/premiums.model';
import { environment } from '../../environments/environment';

const baseUrl = environment.apiURL+'/premiums';

@Injectable({
  providedIn: 'root',
})
export class PremiumsService {
  constructor(private http: HttpClient) {}
  login(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/login`, data);
  }
  getAll(): Observable<Premiums[]> {
    return this.http.get<Premiums[]>(baseUrl);
  }

  get(id: any): Observable<Premiums> {
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

  findByTitle(title: any): Observable<Premiums[]> {
    return this.http.get<Premiums[]>(`${baseUrl}?title=${title}`);
  }
}
