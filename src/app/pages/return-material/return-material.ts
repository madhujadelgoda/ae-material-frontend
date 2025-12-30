import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-return-material',
  imports: [CommonModule, FormsModule],
  templateUrl: './return-material.html'
})
export class ReturnMaterialComponent implements OnInit {

  assignments: any[] = [];
  teams: any[] = [];

  // return input map
  returnMap: Record<number, number> = {};

  // filters
  filterScope: 'today' | 'all' = 'today';
  fromDate = '';
  toDate = '';
  selectedTeamFilter: number | null = null;

  loading = false;
  error = '';
  success = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTeams();
    this.loadAssignments();
  }

  // --------------------------------
  // Load teams for filter
  // --------------------------------
  loadTeams() {
    this.http.get<any[]>(`${environment.apiUrl}/teams`)
      .subscribe({
        next: data => this.teams = data,
        error: () => this.error = 'Failed to load teams'
      });
  }

  // --------------------------------
  // Load assignments with filters
  // --------------------------------
  loadAssignments() {
    const params: any = {
      scope: this.filterScope
    };

    if (this.fromDate && this.toDate) {
      params.from = this.fromDate;
      params.to = this.toDate;
    }

    if (this.selectedTeamFilter) {
      params.team_id = this.selectedTeamFilter;
    }

    this.http.get<any[]>(`${environment.apiUrl}/materials/assignments`, { params })
      .subscribe({
        next: data => {
          this.assignments = data;
        },
        error: () => {
          this.error = 'Failed to load assignments';
        }
      });
  }

  // --------------------------------
  // Remaining quantity calculator
  // --------------------------------
  remaining(a: any): number {
    return a.quantity - (a.returned_quantity ?? 0);
  }

  // --------------------------------
  // Submit return
  // --------------------------------
  submitReturn(a: any) {
    const qty = this.returnMap[a.allocation_id];

    this.error = '';
    this.success = '';

    if (!qty || qty <= 0) {
      this.error = 'Enter a valid return quantity';
      return;
    }

    if (qty > this.remaining(a)) {
      this.error = `Cannot return more than ${this.remaining(a)}`;
      return;
    }

    this.loading = true;

    this.http.post(`${environment.apiUrl}/materials/return`, {
      allocation_id: a.allocation_id,
      quantity_returned: qty
    }).subscribe({
      next: () => {
        this.success = `Returned ${qty} successfully`;
        this.returnMap[a.allocation_id] = 0;
        this.loadAssignments();
      },
      error: err => {
        this.error = err.error?.message || 'Return failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
