import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TimeTrackerService } from '../../services/time-tracker-service';
import { TaskStatsInterface } from '../../models/timeType';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-focus',
  imports: [CommonModule, FormsModule],
  templateUrl: './focus.html',
  styleUrl: './focus.css',
})
export class Focus {
 private timeService = inject(TimeTrackerService);

 
  newTaskName = signal('');
  selectedTaskId = signal('');
  selectedPeriod = signal('all');
  

  timerSeconds = signal(0);
  isTimerRunning = signal(false);
  private timerIntervalId: any = null;


  tasksResource = rxResource({
    stream: () => this.timeService.gettasks()
  });

  statsResource = rxResource({
    params: () => {
      const id = Number(this.selectedTaskId());
      if (!id) return undefined; 
      
      return { 
        id, 
        days: this.selectedPeriod() === 'all' ? undefined : Number(this.selectedPeriod()) 
      };
    },
    stream: ({ params }) => {
      return this.timeService.getTaskStats(params.id, params.days);
    }
  });


  activeTask = computed(() => {
    const id = Number(this.selectedTaskId());
    return this.tasksResource.value()?.find(t => t.id === id) || null;
  });

  formattedTime = computed(() => {
    const totalSecs = this.timerSeconds();
    const hrs = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  });


  addTask(): void {
    const name = this.newTaskName().trim();
    if (!name) return;

    this.timeService.addTask({ name }).subscribe(() => {
      this.newTaskName.set('');
      this.tasksResource.reload();
    });
  }

  startTimer(): void {
    if (!this.selectedTaskId() || this.isTimerRunning()) return;
    this.isTimerRunning.set(true);
    this.timerIntervalId = setInterval(() => this.timerSeconds.update(s => s + 1), 1000);
  }

  pauseTimer(): void {
    if (!this.isTimerRunning()) return;
    this.stopInterval();
    this.saveProgress(false);
  }

  stopTimer(): void {
    if (!this.isTimerRunning() && this.timerSeconds() === 0) return;
    this.stopInterval();
    this.saveProgress(true);
  }

  private stopInterval(): void {
    clearInterval(this.timerIntervalId);
    this.isTimerRunning.set(false);
  }

 private saveProgress(shouldReset: boolean): void {
  const task = this.activeTask();
  if (!task || this.timerSeconds() === 0) return;

 
  const secondsToSend = this.timerSeconds();

  this.timeService.updateTask(task.id, { dedicated_time: secondsToSend }).subscribe(() => {
    this.tasksResource.reload();
    this.statsResource.reload();
    if (shouldReset) this.timerSeconds.set(0);
  });
}
removeTask(id: number) {
  this.timeService.deleteTask(id).subscribe({
    next: () => {
      this.tasksResource.reload()
    }
  })
}
}
