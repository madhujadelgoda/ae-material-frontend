import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html'
})
export class SidebarComponent {
  constructor(private router: Router) {}

  logout() {
    StorageService.clear();
    this.router.navigate(['/login']);
  }
}
