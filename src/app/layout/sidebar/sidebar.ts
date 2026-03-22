import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { CommonModule } from '@angular/common';

import { StorageService } from '../../core/services/storage.service';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    HasPermissionDirective
  ],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {

  username = '';

  constructor(private router: Router) {
    this.username = StorageService.getUsername();
  }

  isAdmin(): boolean {
    return StorageService.hasRole('ADMIN');
  }

  confirmLogout(): void {
    const confirmed = window.confirm(
      'Are you sure you want to logout?'
    );

    if (!confirmed) {
      return;
    }

    this.logout();
  }

  private logout(): void {
    StorageService.clear();
    this.router.navigate(['/login']);
  }
}
