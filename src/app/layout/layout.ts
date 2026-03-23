import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, BreadcrumbComponent],
  selector: 'app-layout',
  templateUrl: './layout.html'
})
export class LayoutComponent {
  isMobileViewport = false;
  sidebarCollapsed = false;
  mobileSidebarOpen = false;

  constructor() {
    this.syncViewportState();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.syncViewportState();
  }

  toggleSidebar(): void {
    if (this.isMobileViewport) {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
      return;
    }

    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  closeMobileSidebar(): void {
    if (!this.isMobileViewport) {
      return;
    }

    this.mobileSidebarOpen = false;
  }

  private syncViewportState(): void {
    const width = window.innerWidth;
    const isMobile = width <= 768;
    const isTablet = width > 768 && width <= 1024;

    this.isMobileViewport = isMobile;

    if (isMobile) {
      this.mobileSidebarOpen = false;
      this.sidebarCollapsed = false;
      return;
    }

    this.mobileSidebarOpen = false;
    this.sidebarCollapsed = isTablet;
  }
}
