import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { JournalingService } from '../../services/journaling-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { retry } from 'rxjs';
import { JournalInterface } from '../../models/journalTypes';


@Component({
  selector: 'app-journaling',
  imports: [ReactiveFormsModule],
  templateUrl: './journaling.html',
  styleUrl: './journaling.css',
})
export class Journaling {

  id = input.required<string>();
  showJournal = signal(false)

  journalToCheck = signal<JournalInterface | null>(null)
   Monthes = ['Juanury', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]

   today = new Date()
   todaystring = signal(this.today.toISOString().split('T')[0])

  years = Array.from(
    { length: 5 }, 
    (_, i) => this.today.getFullYear() - 3 + i
  );

  journalService = inject(JournalingService)


  monthValue = signal(this.today.getMonth() + 1)
  yearValue = signal(this.today.getFullYear())


   statistics = rxResource<string[], { year: number; month: number }>({
    params: () =>  ({
      year: this.yearValue(),
      month: this.monthValue()

    }),
    stream: ({params}) =>  {
    
    
    return this.journalService.getMonthlyGrid(
      params.year, params.month
    );
    }
  })






  todayJournal = rxResource({
    params: () => this.todaystring(),
    stream: ({params}) => this.journalService.getJournals(params)
  })

  template = rxResource({
    stream: () => this.journalService.getSingleTemplate(Number(this.id()))
  })

  journalForm = new FormGroup({
    template_used: new FormControl<number | null>(null, Validators.required),
    date: new FormControl(this.today.toISOString().split('T')[0], { validators: [Validators.required], nonNullable: true }),
    responses: new FormArray([
      
    ])

  })

  private checkRouteId = effect(()=> {
    const routeId = this.id();

    this.journalForm.patchValue({
      template_used: Number(routeId)
    })
  })


  private buildFormEffect = effect(() => {
  const journal = this.todayJournal.value();
  const activeTemplate = this.template.value();

  
  if (!journal && activeTemplate) {
    
   
    const questions = activeTemplate.questions;

    this.responsArray.clear();
   
    for (let i = 0; i < questions.length; i++) {
      
      this.responsArray.push(
        new FormGroup({
         
          question: new FormControl(questions[i].id),
          answer: new FormControl("", { validators: [Validators.required], nonNullable: true })
        })
      );

    }
  }
});
 

  get responsArray() {
    return this.journalForm.get('responses') as FormArray
  }

  

  createJournal() {
    if (this.journalForm.valid) {
     const formData = this.journalForm.getRawValue();
     this.journalService.writeJournal(formData).subscribe({
      next: () => {
        this.todayJournal.reload()
      }, 
      error: (err) => {
        console.error(err)
      }
     })
    }

  }


  onMonthChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.monthValue.set(Number(select.value));
  }

  onYearChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.yearValue.set(Number(select.value));
  }


  daysInMonthGrid = computed<string[]>(() => {
    const year = this.yearValue();
    const month = this.monthValue();
    
  
    const totalDays = new Date(year, month, 0).getDate();
    const dateStrings: string[] = [];

    for (let day = 1; day <= totalDays; day++) {
     
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      
      dateStrings.push(`${year}-${formattedMonth}-${formattedDay}`);
    }

    return dateStrings;
  });



  journalFromStats(day: string) {
    this.journalService.getJournals(day).subscribe({
      next: (data) => {
        this.journalToCheck.set(data)
        this.showJournal.update(v=> !v)

      }, 
      error: (err) => console.error(err)
    })
  }



  removeJournal(date: string) {
    this.journalService.deleteJournal(date).subscribe({
      next: () => {
        this.todayJournal.reload()
        this.showJournal.set(false)
        this.statistics.reload()
      }
    })

  }

}
