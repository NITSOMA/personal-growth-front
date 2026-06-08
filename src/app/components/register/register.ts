import { Component, Inject, inject } from '@angular/core';
import { User } from '../../services/user';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  userService = inject(User);
  router = inject(Router)

  registerForm = new FormGroup({
    username: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.email, Validators.required]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    profile_image: new FormControl<File | null>(null)
    
  })


  addImage(event: any){
    const file: File = event.target.files[0];
    if (file){
      this.registerForm.patchValue({
        profile_image: file
      })
    }
  }


submitRegisterData(){
  if (this.registerForm.valid){
    const formdata = new FormData();
    const registerValues = this.registerForm.value;

    formdata.append("username", registerValues.username!)
    formdata.append("email", registerValues.email!)
    formdata.append("password", registerValues.password!)

    if (registerValues.profile_image){
      formdata.append("profile_image", registerValues.profile_image!)
    }

    this.userService.registerUser(formdata).subscribe({
      next: () => {
        
        this.router.navigate(['/login'])

      }, 
      error: (err) => console.error(err)
    })
  }

  
}


}



