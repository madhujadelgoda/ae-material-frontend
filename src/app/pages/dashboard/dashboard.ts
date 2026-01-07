import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardSummary } from '../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-dashboard',
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


  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
      },
      error: (err) => {
        console.error('Failed to load dashboard summary', err);
      }
    });
  }
}
