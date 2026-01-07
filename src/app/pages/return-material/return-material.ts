import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-return-material',
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './return-material.html'
})
export class ReturnMaterialComponent implements OnInit {

  assignments: any[] = [];
  teams: any[] = [];

  returnMap: Record<number, number> = {};

  filterScope: 'today' | 'all' = 'today';
  fromDate = '';
  toDate = '';
  selectedTeamFilter: number | null = null;

  loading = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTeams();
    this.loadAssignments();
  }

  // ----------------------------
  // Snackbar helper
  // ----------------------------
  showSnack(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }

  // ----------------------------
  // Load teams
  // ----------------------------
  loadTeams() {
    this.http.get<any[]>(`${environment.apiUrl}/teams`)
      .subscribe({
        next: data => this.teams = data,
        error: () => this.showSnack('Failed to load teams', 'error')
      });
  }

  // ----------------------------
  // Load assignments
  // ----------------------------
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
        next: data => this.assignments = data,
        error: () => this.showSnack('Failed to load assignments', 'error')
      });
  }

  // ----------------------------
  // Remaining quantity
  // ----------------------------
  remaining(a: any): number {
    return a.quantity - (a.returned_quantity ?? 0);
  }

  // ----------------------------
  // Submit return
  // ----------------------------
  submitReturn(a: any) {
    const qty = this.returnMap[a.allocation_id];

    if (!qty || qty <= 0) {
      this.showSnack('Enter a valid return quantity', 'error');
      return;
    }

    if (qty > this.remaining(a)) {
      this.showSnack(`Cannot return more than ${this.remaining(a)}`, 'error');
      return;
    }

    this.loading = true;

    this.http.post(`${environment.apiUrl}/materials/return`, {
      allocation_id: a.allocation_id,
      quantity_returned: qty
    }).subscribe({
      next: () => {
        this.showSnack(`Returned ${qty} successfully`, 'error');
        this.returnMap[a.allocation_id] = 0;
        this.loadAssignments();
      },
      error: err => {
        this.showSnack(err.error?.message || 'Return failed', 'error');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
