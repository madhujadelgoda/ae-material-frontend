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
  statCards = [
    {
      key: 'totalMaterials',
      label: 'Total Materials',
      icon: 'inventory_2',
      color: 'blue'
    },
    {
      key: 'totalTeams',
      label: 'Total Teams',
      icon: 'groups',
      color: 'purple'
    },
    {
      key: 'totalAllocations',
      label: 'Total Allocations',
      icon: 'receipt_long',
      color: 'indigo'
    },
    {
      key: 'activeAllocations',
      label: 'Active Allocations',
      icon: 'task_alt',
      color: 'green'
    },
    {
      key: 'returnedToday',
      label: 'Returned Today',
      icon: 'assignment_return',
      color: 'orange'
    },
    {
      key: 'todayAllocations',
      label: 'Allocated Today',
      icon: 'calendar_today',
      color: 'teal'
    }
  ];

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

  getStatValue(key: string): number {
    switch (key) {
      case 'totalMaterials': return this.summary.totalMaterials;
      case 'totalTeams': return this.summary.totalTeams;
      case 'totalAllocations': return this.summary.totalAllocations;
      case 'activeAllocations': return this.summary.activeAllocations;
      case 'returnedToday': return this.summary.returnedToday;
      case 'todayAllocations': return this.summary.todayAllocations;
      default: return 0;
    }
  }
}
