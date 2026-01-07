import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, BreadcrumbComponent],
  selector: 'app-layout',
  templateUrl: './layout.html'
})
export class LayoutComponent {}
