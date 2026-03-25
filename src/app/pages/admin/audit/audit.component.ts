import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-audit',
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './audit.component.html'
})
export class AuditComponent {}
