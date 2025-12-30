import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (!StorageService.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
