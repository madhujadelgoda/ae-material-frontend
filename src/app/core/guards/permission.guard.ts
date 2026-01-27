import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const permissionGuard = (permission: string): CanActivateFn => {
  return () => {
    const router = inject(Router);

    if (!StorageService.hasPermission(permission)) {
      router.navigate(['/dashboard']); // or /unauthorized
      return false;
    }

    return true;
  };
};
