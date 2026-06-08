import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../app.config.token';
import { TaskStatsInterface, TimeRequest, TimeTrackerInerface } from '../models/timeType';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeTrackerService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  private timeApi = `${this.config.apiUrl}/timemanagment/`;
  private stats = `${this.config.apiUrl}/timemanagment/stats/`;

 
  gettasks(): Observable<TimeTrackerInerface[]> {
    return this.http.get<TimeTrackerInerface[]>(this.timeApi);
  }


  getTaskById(id: number): Observable<TimeTrackerInerface> {
    return this.http.get<TimeTrackerInerface>(`${this.timeApi}${id}/`);
  }


  addTask(task: TimeRequest): Observable<TimeTrackerInerface> {
    return this.http.post<TimeTrackerInerface>(this.timeApi, task);
  }


  updateTask(id: number, data: Partial<TimeRequest>): Observable<TimeTrackerInerface> {
    return this.http.patch<TimeTrackerInerface>(`${this.timeApi}${id}/`, data);
  }


  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.timeApi}${id}/`);
  }

  
  getTaskStats(id: number, days?: number): Observable<TaskStatsInterface> {
  let params = new HttpParams();
  
  if (days !== undefined) {
    params = params.set('days', days.toString());
  }

  return this.http.get<TaskStatsInterface>(`${this.stats}${id}/`, { params });
}
}