import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionCategories } from '../models/question-categories.model';
import { environment } from '../../environments/environment';

const baseUrl = `${environment.apiURL}/question-categories`;

@Injectable({
  providedIn: 'root',
})
export class QuestionCategoriesService {
  constructor(private http: HttpClient) {}

  getAll(limit: any): Observable<QuestionCategories[]> {
    return this.http.get<QuestionCategories[]>(`${baseUrl}?limit=${limit}`);
  }

  get(id: any): Observable<QuestionCategories> {
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
