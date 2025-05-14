import { inject, Injectable } from '@angular/core';
import { API_BASE_ENDPOINT } from '../app.token';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  assigneeId?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  baseURL = inject(API_BASE_ENDPOINT);
  constructor(private http: HttpClient) {}

  list(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseURL);
  }

  create(title: string): Observable<Task> {
    return this.http.post<Task>(this.baseURL, { title });
  }

  move(id: string, status: Task['status']): Observable<Task> {
    return this.http.patch<Task>(`${this.baseURL}/${id}`, { status });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseURL}/${id}`);
  }
}
