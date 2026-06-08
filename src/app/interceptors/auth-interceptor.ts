import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { User } from '../services/user'; 

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(User);
  const token = userService.accessToken();

  
    let authReq = req.clone({
    withCredentials: true,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
  });

 
  if (req.url.includes('/refresh')) {
    return next(authReq);
  }

  
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
    
      if (error.status !== 401) {
        return throwError(() => error);
      }

      
      return userService.refreshToken().pipe(
        take(1),
        switchMap((response) => {
          
          const newToken = userService.accessToken();

          if (!newToken) {
            return throwError(() => new Error('Refresh failed - No token received'));
          }

          
          const retryReq = req.clone({
            withCredentials: true,
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });

          return next(retryReq);
        }),
        catchError((refreshError) => {
          
          userService.logoutUser().subscribe();
          return throwError(() => refreshError);
        })
      );
    })
  );
    
  }

 
  
