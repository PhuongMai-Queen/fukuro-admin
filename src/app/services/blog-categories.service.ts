import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogCategories } from '../models/blog-categories.model';
import { environment } from '../../environments/environment';

const baseUrl = `${environment.apiURL}/blog-categories`;

@Injectable({
  providedIn: 'root',
})
export class BlogCategoriesService {
  constructor(private http: HttpClient) {}

  getAll(limit: any): Observable<BlogCategories[]> {
    return this.http.get<BlogCategories[]>(`${baseUrl}?limit=${limit}&status=both&orderby=desc`);
  }

  get(id: any): Observable<BlogCategories> {
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

  findByTitle(title: any): Observable<BlogCategories[]> {
    return this.http.get<BlogCategories[]>(`${baseUrl}?title=${title}`);
  }
}
