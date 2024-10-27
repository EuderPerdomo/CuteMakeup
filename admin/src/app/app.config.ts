import { ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { provideRouter } from '@angular/router';
//import { NgxTinymceModule } from 'ngx-tinymce';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AdminService } from './service/admin.service';
import { ErrorResponseInterceptor } from './guards/error-response-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([ErrorResponseInterceptor])),
    AdminService, 
    JwtHelperService, 
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    ]
};


/*
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),AdminService, JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    ]
};
*/