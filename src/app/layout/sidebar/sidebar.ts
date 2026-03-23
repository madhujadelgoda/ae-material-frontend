import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

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
  @Input() collapsed = false;
  @Input() isMobileViewport = false;
  @Input() mobileOpen = false;
  @Output() navigate = new EventEmitter<void>();

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

  onNavigate(): void {
    if (!this.isMobileViewport) {
      return;
    }

    this.navigate.emit();
  }

  private logout(): void {
    StorageService.clear();
    this.navigate.emit();
    this.router.navigate(['/login']);
  }
}
