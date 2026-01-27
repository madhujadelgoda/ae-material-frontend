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

  ngOnInit(): void {
    this.loadAllocations();
  }

  // ----------------------------
  // Toast helper
  // ----------------------------
  notify(message: string, type: 'success' | 'error' = 'success'): void {
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
  loadAllocations(): void {
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
  // Returned quantity logic (FIXED)
  // ----------------------------
  
  returnedQty(a: any): number | null {

    // After return → trust backend
    if (this.isLocked(a)) {
      return a.returned_quantity;
    }

    const used = this.usedQty[a.allocation_id] || 0;
    const damaged = this.damagedQty[a.allocation_id] || 0;

    if (used + damaged === 0) {
      return null;
    }

    return Math.max(
      a.allocated_quantity - used,
      0
    );
  }

  // Submit usage + return
  submitUsageAndReturn(a: any): void {

    if (this.isLocked(a) || this.loading) return;

    const used = this.usedQty[a.allocation_id] || 0;
    const damaged = this.damagedQty[a.allocation_id] || 0;

    // MUST have at least one value
    if (used + damaged <= 0) {
      this.notify('Used or Damaged quantity is required', 'error');
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
      usage_type: 'USED',
      remarks: null
    }).subscribe({
      next: () => {

        // Record DAMAGED
        const damaged$ = damaged > 0
          ? this.http.post(`${environment.apiUrl}/materials/usage`, {
              allocation_id: a.allocation_id,
              quantity: damaged,
              usage_type: 'DAMAGED',
              remarks: null
            })
          : null;

        const proceedToReturn = () => {
          // Auto return remaining
          this.http.post(
            `${environment.apiUrl}/materials/return/${a.allocation_id}`,
            {}
          ).subscribe({
            next: () => {
              this.notify('Usage recorded & materials returned');
              delete this.usedQty[a.allocation_id];
              delete this.damagedQty[a.allocation_id];
              this.loadAllocations();
            },
            error: () => this.notify('Return failed', 'error'),
            complete: () => this.loading = false
          });
        };

        if (damaged$) {
          damaged$.subscribe({
            next: proceedToReturn,
            error: () => {
              this.notify('Damaged usage failed', 'error');
              this.loading = false;
            }
          });
        } else {
          proceedToReturn();
        }

      },
      error: () => {
        this.notify('Usage recording failed', 'error');
        this.loading = false;
      }
    });
  }
}
