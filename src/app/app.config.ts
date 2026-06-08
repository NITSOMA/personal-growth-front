import { ApplicationConfig, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { APP_CONFIG } from './app.config.token';
import { environment } from '../environments/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth-interceptor';
import { initializeAuth } from './app.initializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()), 
    {provide: APP_CONFIG, useValue: environment},
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAppInitializer(initializeAuth),
    
   
  ]
};
