import { CanActivateFn } from '@angular/router';
import { AdminService } from '../service/admin.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { inject } from '@angular/core';


export const adminGuard: CanActivateFn = (route, state) => {

  const adminService = inject(AdminService);
  const router = inject(Router);
  const allowedRoles = route.data['allowedRoles'] as string[] || ['admin'];
  return adminService.isAuthenticated(allowedRoles).pipe(

    tap((isAuthenticated) => {
      if (!isAuthenticated) {    
        router.navigateByUrl('/login');
      }
    })
  );
  
};

