import { Component, inject } from '@angular/core';
import { User } from '../../services/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  userService = inject(User)
  router = inject(Router)
  loginForm = new FormGroup({
    login_id: new FormControl("", {nonNullable: true, validators: Validators.required}),
    password: new FormControl("", {nonNullable: true, validators: Validators.required})
  })

  loginUser(){
    if (this.loginForm.valid) {
      this.userService.loginUser(this.loginForm.getRawValue()).subscribe({
        next: () => {
          this.router.navigate(['/profile'])
        }, 
        error: (err) => console.error(err)
      })
    }
  }



}
