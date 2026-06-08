import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../app.config.token';
import { Observable } from 'rxjs';
import { HabitInterface, HabitRequestInterface, Log, LogsGrid, MonthlyCalendarData } from '../models/habitType';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private http = inject(HttpClient)
    private config = inject(APP_CONFIG);

  private habitApi = `${this.config.apiUrl}/hebits/`;
  private logsApi = `${this.config.apiUrl}/hebits/logs/`;
   private logsGrid = `${this.config.apiUrl}/hebits/logs/grid/`;
  private calendarApi = `${this.config.apiUrl}/hebits/logs/calendar/`;


  getHabits(){
    return this.http.get<HabitInterface[]>(this.habitApi)
  }

  createHabit(data: HabitRequestInterface) {
    return this.http.post(this.habitApi, data)

  }

  checkHabit(logData: Log){
    return this.http.post(this.logsApi, logData)

  }

  deleteLog(habitpk:number) {
    return this.http.delete(`${this.logsApi}${habitpk}/`)
  }

   

  getMonthlyGrid(year: number, month: number): Observable<LogsGrid[]> {
  return this.http.get<LogsGrid[]>(this.logsGrid, {
    params: {
      year: year.toString(),
      month: month.toString()
    }
  });
}

deleteHabit(id: number){ 
  return this.http.delete(`${this.habitApi}${id}/`)

}

  
}
