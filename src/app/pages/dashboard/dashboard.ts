import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  DashboardService,
  DashboardSummary
} from '../../core/services/dashboard.service';

import { StorageService } from '../../core/services/storage.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {

  summary: DashboardSummary = {
    totalMaterials: 0,
    totalTeams: 0,
    totalAllocations: 0,
    activeAllocations: 0,
    returnedToday: 0,
    todayAllocations: 0
  };

  loading = false;
  error = '';

  constructor(
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    if (!this.canViewDashboard()) {
      this.error = 'You do not have permission to view the dashboard';
      return;
    }

    this.loadSummary();
  }

  /**
   * Permission gate for dashboard
   */
  canViewDashboard(): boolean {
    return StorageService.getToken() !== null;
  }

  /**
   * Load dashboard summary data
   */
  loadSummary(): void {
    this.loading = true;
    this.error = '';

    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard summary', err);
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }
}
