import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-return-material',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './return-material.html'
})
export class ReturnMaterialComponent implements OnInit {

  allocations: any[] = [];

  usedQty: Record<number, number> = {};
  damagedQty: Record<number, number> = {};

  loading = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAllocations();
  }

  // ----------------------------
  // Toast
  // ----------------------------
  notify(message: string, type: 'success' | 'error' = 'success') {
    this.snackBar.open(message, 'Close', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }

  // ----------------------------
  // Load allocations
  // ----------------------------
  loadAllocations() {
    this.http
      .get<any[]>(`${environment.apiUrl}/materials/allocations`)
      .subscribe({
        next: data => this.allocations = data,
        error: () => this.notify('Failed to load allocations', 'error')
      });
  }

  // ----------------------------
  // Lock row once returned
  // ----------------------------
  isLocked(a: any): boolean {
    return a.status === 'RETURNED';
  }

  // ----------------------------
  // Returned quantity logic
  // ----------------------------
  /**
   * BEFORE return  -> preview = allocated - used
   * AFTER return   -> show backend returned_quantity
   */
  returnedQty(a: any): number | null {

    // After return → trust backend
    if (this.isLocked(a)) {
      return a.returned_quantity;
    }

    // Before return → preview
    const used = this.usedQty[a.allocation_id];
    if (used === undefined || used === null) {
      return null;
    }

    return Math.max(a.allocated_quantity - used, 0);
  }

  // ----------------------------
  // Submit usage + return
  // ----------------------------
  submitUsageAndReturn(a: any) {

    if (this.isLocked(a)) return;

    const used = this.usedQty[a.allocation_id] || 0;
    const damaged = this.damagedQty[a.allocation_id] || 0;

    if (used <= 0) {
      this.notify('Used quantity is required', 'error');
      return;
    }

    if (used + damaged > a.allocated_quantity) {
      this.notify('Used + Damaged exceeds allocated quantity', 'error');
      return;
    }

    const returned = a.allocated_quantity - used;

    const ok = window.confirm(
      `Confirm usage & return?\n\n` +
      `Allocated : ${a.allocated_quantity}\n` +
      `Used      : ${used}\n` +
      `Damaged   : ${damaged}\n` +
      `Returned  : ${returned}\n\n` +
      `⚠ Damaged items are returned to ERP for review`
    );

    if (!ok) return;

    this.loading = true;

    // Record USED
    this.http.post(`${environment.apiUrl}/materials/usage`, {
      allocation_id: a.allocation_id,
      quantity: used,
      usage_type: 'USED'
    }).subscribe({
      next: () => {

        // Record DAMAGED (optional)
        if (damaged > 0) {
          this.http.post(`${environment.apiUrl}/materials/usage`, {
            allocation_id: a.allocation_id,
            quantity: damaged,
            usage_type: 'DAMAGED'
          }).subscribe();
        }

        // Auto-return remaining (allocated - used)
        this.http.post(
          `${environment.apiUrl}/materials/return/${a.allocation_id}`,
          {}
        ).subscribe({
          next: () => {
            this.notify('Usage recorded & materials returned');
            this.usedQty[a.allocation_id] = undefined!;
            this.damagedQty[a.allocation_id] = undefined!;
            this.loadAllocations();
          },
          error: () => this.notify('Return failed', 'error'),
          complete: () => this.loading = false
        });

      },
      error: () => {
        this.notify('Usage recording failed', 'error');
        this.loading = false;
      }
    });
  }
}
