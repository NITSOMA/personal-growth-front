import { catchError, lastValueFrom, Observable, of } from "rxjs";
import { User } from "./services/user";
import { inject } from "@angular/core";

export function initializeAuth(){
    const userService = inject(User);

    return lastValueFrom(userService.refreshToken().pipe(
        catchError(()=> of(null))
    ))
}