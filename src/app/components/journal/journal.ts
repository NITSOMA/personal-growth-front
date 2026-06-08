import { Component, inject, signal } from '@angular/core';
import { JournalingService } from '../../services/journaling-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { JournalTemplate } from '../../models/journalTypes';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { form, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-journal',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './journal.html',
  styleUrl: './journal.css',
})
export class Journal {

  date = new Date()
  journService = inject(JournalingService)
  createMode = signal(false)

  templateForm = new FormGroup({
    name: new FormControl("", {validators: [Validators.required], nonNullable: true}),
    questions: new FormArray([
      new FormGroup({
        text: new FormControl("", {validators: [Validators.required], nonNullable: true}),
        order: new FormControl(0, {nonNullable: true})
      })
    ])
  })

  get questionsArray(): FormArray<FormGroup<{
  text: FormControl<string>;
  order: FormControl<number>;
}>> {
  return this.templateForm.get('questions') as FormArray;
}


  userTemplates = rxResource<JournalTemplate[], undefined>({
    stream: () => this.journService.getUserTemplate()
  })

  defaultTemplates = rxResource({
    stream: () => this.journService.getdefaultTemplate()
  })


  saveTemplate() {
    this.journService.createTemplate(this.templateForm.getRawValue()).subscribe({
      next: () => {
        this.userTemplates.reload()
      }
    })
  }



addQuestion(): void {
  const questionGroup = new FormGroup({
    text: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    order: new FormControl(this.questionsArray.length, { nonNullable: true })
  });
  
  this.questionsArray.push(questionGroup);
}
  

deleteTemplate(id: number) {
  this.journService.deleteTemplate(id).subscribe({
    next: () => {
      this.userTemplates.reload()
    }
  })

}

}
