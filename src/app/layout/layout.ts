import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';

@Component({
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  selector: 'app-layout',
  templateUrl: './layout.html'
})
export class LayoutComponent {}
