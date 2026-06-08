import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../app.config.token';
import { CreateJournal, CreateJournalTemplate, JournalInterface, JournalTemplate } from '../models/journalTypes';

@Injectable({
  providedIn: 'root',
})
export class JournalingService {
  private http = inject(HttpClient)
  private config = inject(APP_CONFIG)

  private journalApi = `${this.config.apiUrl}/journaling/journals/`;
  private templateApi = `${this.config.apiUrl}/journaling/templates/`;
  private defaultTemplate = `${this.config.apiUrl}/journaling/templates/defaults/`;
  private datesApi = `${this.config.apiUrl}/journaling/dates/`;


  getUserTemplate() {
    return this.http.get<JournalTemplate[]>(this.templateApi)
  }


   getdefaultTemplate() {
    return this.http.get<JournalTemplate[]>(this.defaultTemplate)
  }



  createTemplate(template: CreateJournalTemplate) {
    return this.http.post<JournalTemplate>(this.templateApi, template)
  }

  deleteTemplate(pk: number) {
    return this.http.delete(`${this.templateApi}${pk}/`)
  }

  getSingleTemplate(pk: number) {
    return this.http.get<JournalTemplate>(`${this.templateApi}${pk}/`)
  }
  getJournals(dateString: string) {
    return this.http.get<JournalInterface | null>(this.journalApi, {params: {date: dateString}})
  }

  writeJournal(journal: CreateJournal) {
    return this.http.post<JournalInterface>(this.journalApi, journal)
  }

  deleteJournal(dateString: string) {
    return this.http.delete(this.journalApi, {params: {date: dateString}})
  }

  getMonthlyGrid(year: number, month: number) {
    return this.http.get<[]>(this.datesApi, {
      params: {
        year: year.toString(),
        month: month.toString()
      }
    });
  }
}
