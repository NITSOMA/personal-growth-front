import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../services/user';

export const profileguardGuard: CanActivateFn = (route, state) => {
  const userService = inject(User)
  const router = inject(Router)
  if (userService.accessToken()){
    return true
  }
  router.navigate(['/login'])
  return false;
};
