import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbService, Breadcrumb } from '../../core/services/breadcrumb.service';

@Component({
  standalone: true,
  selector: 'app-breadcrumb',
  imports: [
    CommonModule
  ],
  template: `
    <div class="breadcrumb">
      <ng-container *ngFor="let b of breadcrumbs; let last = last">
        <span class="crumb" [class.active]="last">
          {{ b.label }}
        </span>
        <span *ngIf="!last" class="sep">/</span>
      </ng-container>
    </div>
  `,
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {

  breadcrumbs: Breadcrumb[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.breadcrumbsObs$.subscribe(
      (items: Breadcrumb[]) => {
        this.breadcrumbs = items;
      }
    );
  }
}
