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
  userRole = 'System User';
  showLogoutConfirm = false;

  constructor(private router: Router) {
    this.username = StorageService.getUsername();

    const roles = StorageService.getRoles();
    if (roles.length > 0) {
      this.userRole = roles[0].replace(/_/g, ' ');
    }
  }

  isAdmin(): boolean {
    return StorageService.hasRole('ADMIN');
  }

  confirmLogout(): void {
    this.showLogoutConfirm = true;
  }

  closeLogoutConfirm(): void {
    this.showLogoutConfirm = false;
  }

  confirmLogoutNow(): void {
    this.showLogoutConfirm = false;
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
