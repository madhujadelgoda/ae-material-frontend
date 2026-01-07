import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const roleGuard = (role: string): CanActivateFn => {
  return () => {
    const token = StorageService.getToken();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload.roles || [];

    if (!roles.includes(role)) {
      alert('Access denied');
      return false;
    }

    return true;
  };
};
