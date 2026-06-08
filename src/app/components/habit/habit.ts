import { Component, inject, signal } from '@angular/core';
import { HabitService } from '../../services/habit-service';
import { LogsGrid, MonthlyCalendarData} from '../../models/habitType';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-habit',
  imports: [ReactiveFormsModule],
  templateUrl: './habit.html',
  styleUrl: './habit.css',
})
export class Habit {
  private habitService  = inject(HabitService)
  addHabitMode = signal(false)
  
 
  Monthes = ['Juanury', 'February', 'March', 'April', 
    'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]

   today = new Date()
  years = Array.from(
    { length: 5 }, 
    (_, i) => this.today.getFullYear() - 3 + i
  );



 


   
  monthValue = signal(this.today.getMonth() + 1)
  yearValue = signal(this.today.getFullYear())

  statistics = rxResource({
    params: () =>  ({
      year: this.yearValue(),
      month: this.monthValue()

    }),
    stream: ({params}) =>  {
    
    
    return this.habitService.getMonthlyGrid(
      params.year, params.month
    );
    }
  })


  


  getGrid(year: number, month: number) {
    this.yearValue.set(year)
    this.monthValue.set(month)

  }
 


  habitsAll = rxResource({
    stream: () => this.habitService.getHabits()
  })

  habitForm = new FormGroup({
    name: new FormControl("", {validators: [Validators.required], nonNullable: true})
  })







  saveHabit() {
    if (this.habitForm.valid) {
      this.habitService.createHabit(this.habitForm.getRawValue()).subscribe({
        next: () => {
          this.habitsAll.reload()
        },
        error: (err) => console.error(err)
      })
    }
  }

completionChange(habitId: number, event: Event) {
  const element = event.target as HTMLInputElement;
  const isCheked = element.checked
  if (isCheked) {
    this.habitService.checkHabit({"habit": habitId, "date": this.today.toISOString().split('T')[0]}).subscribe(
)
  } else {
    this.habitService.deleteLog(habitId).subscribe(
     
    )
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


  gridCellType(percentage: number): string {
    if (percentage === 100) {
      return "level-4"
    } else if ( percentage > 50) {
      return "level-3"
    } else if (percentage > 30) {
      return "level-2"
    } else if (percentage === 0) {
      return "level-0"
    } else {
      return "level-1"
    }
  } 



  deleteHabit(id: number) {
    this.habitService.deleteHabit(id).subscribe({
      next: () => {
        this.habitsAll.reload()
       
      }
    })
  }
}
