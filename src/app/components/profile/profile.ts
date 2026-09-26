import { Component, inject, signal } from '@angular/core';
import { User } from '../../services/user';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { UserProfileInterface } from '../../models/userTypes';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  userSErvice = inject(User)
  personalOpen = signal(false)
  router = inject(Router)
  deleteMode = signal(false)
  profileData = rxResource({
    stream: () => this.userSErvice.getProfile()
  })

  updateProfileForm = new FormGroup({
    username: new FormControl("", Validators.required),
    

  })

  updateProfileImage = new FormGroup({
     profile_image: new FormControl<File | null>(null)
    
  })


    addImage(event: any){
    const file: File = event.target.files[0];
    if (file){
      this.updateProfileImage.patchValue({
        profile_image: file
      })
    }
    const formdata = new FormData();
    if (this.updateProfileImage.valid){
      const registerValues = this.updateProfileImage.value;
      formdata.append("profile_image", registerValues.profile_image!)
    }

       this.userSErvice.updateProfile(formdata).subscribe({
      next: () => {
        
        this.profileData.reload()
        this.personalOpen.set(false)

      }, 
      error: (err) => console.error(err)
    })
    
  }



  submitRegisterData() {
      if (this.updateProfileForm.valid){
    const formdata = new FormData();
    const registerValues = this.updateProfileForm.value;

    formdata.append("username", registerValues.username!)
    
  
    this.userSErvice.updateProfile(formdata).subscribe({
      next: () => {
        
        this.profileData.reload()
        this.personalOpen.set(false)

      }, 
      error: (err) => console.error(err)
    })
  }
    
    
  }


  signOut() {
    this.userSErvice.logoutUser().subscribe({
      next: () => {
        this.router.navigate(['/login'])
      }, 
      error: (err) => {
        console.error(err)
      }
    })
  }


  deleteAccount() {
    this.userSErvice.delete().subscribe({
      next: () => {
        this.router.navigate(['/register'])
      }, 
      error: (err) => {
        console.error(err)
      }
    })
  }
}
