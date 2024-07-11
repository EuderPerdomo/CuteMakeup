import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ClienteService } from './service/cliente.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    ClienteService,
    JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  ]
};
