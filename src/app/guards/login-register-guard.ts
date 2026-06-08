import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../services/user';

export const loginRegisterGuard: CanActivateFn = (route, state) => {
  const userService = inject(User)
  const router = inject(Router)
  if (userService.accessToken()) {
      router.navigate(['/profile'])
      return false
  } else {
     return true;

  }
 
};
