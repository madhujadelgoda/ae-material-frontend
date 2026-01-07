import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    CommonModule,   
    RouterLink
  ],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {

  isAdmin = false;
  username = '';

  constructor(private router: Router) {
    this.isAdmin = StorageService.hasRole('ADMIN');
    this.username = StorageService.getUsername();
  }

  logout() {
    StorageService.clear();
    this.router.navigate(['/login']);
  }
}
