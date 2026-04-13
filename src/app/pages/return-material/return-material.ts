import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from '../../../environments/environment';

import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { StorageService } from '../../core/services/storage.service';

interface Allocation {
  allocation_id: number;
  team_name: string;
  material_code: string;
  allocated_quantity: number;
  returned_quantity: number;
  status: string;
}

@Component({
  standalone: true,
  selector: 'app-return-material',
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    HasPermissionDirective
  ],
  templateUrl: './return-material.html'
})
export class ReturnMaterialComponent implements OnInit {

  allocations: Allocation[] = [];

  usedQty: Record<number, number> = {};
  damagedQty: Record<number, number> = {};

  loading = false;

  canReturn = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  // ============================
  // INIT
  // ============================

  ngOnInit(): void {

    this.canReturn =
      StorageService.hasPermission('material.return');

    this.loadAllocations();
  }

  // ============================
  // TOAST
  // ============================

  notify(
    message: string,
    type: 'success' | 'error' = 'success'
  ): void {

    this.snackBar.open(message, 'Close', {
      duration: 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }

  // ============================
  // LOAD
  // ============================

  loadAllocations(): void {

    this.http
      .get<Allocation[]>(`${environment.apiUrl}/materials/allocations`)
      .subscribe({
        next: data => {
          this.allocations = data;

          // clear preview caches
          this.usedQty = {};
          this.damagedQty = {};
        },
        error: () =>
          this.notify('Failed to load allocations', 'error')
      });
  }

  // ============================
  // LOCKED?
  // ============================

  isLocked(a: Allocation): boolean {
    return a.status === 'RETURNED';
  }

  trackByAllocationId(_: number, a: Allocation): number {
    return a.allocation_id;
  }

  getUsed(a: Allocation): number {
    return this.usedQty[a.allocation_id] || 0;
  }

  getDamaged(a: Allocation): number {
    return this.damagedQty[a.allocation_id] || 0;
  }

  getReturnedDisplay(a: Allocation): number | string {
    const returned = this.returnedQty(a);
    return returned === null ? '—' : returned;
  }

  isSubmitDisabled(a: Allocation): boolean {
    return (
      this.loading ||
      this.isLocked(a) ||
      !this.canReturn ||
      (this.getUsed(a) <= 0)
    );
  }

  getSubmitLabel(a: Allocation): string {
    return this.isLocked(a) ? 'Completed' : 'Confirm & Return';
  }

  // ============================
  // RETURN PREVIEW
  // ============================

  returnedQty(a: Allocation): number | null {

    // backend truth
    if (this.isLocked(a)) {
      return a.returned_quantity;
    }

    const used = this.usedQty[a.allocation_id] || 0;

    if (used <= 0) {
      return null;
    }

    return Math.max(
      a.allocated_quantity - used,
      0
    );
  }

  // ============================
  // SUBMIT
  // ============================

  submitUsageAndReturn(a: Allocation): void {

    if (!this.canReturn) return;
    if (this.isLocked(a) || this.loading) return;

    const used = this.usedQty[a.allocation_id] || 0;
    const damaged = this.damagedQty[a.allocation_id] || 0;

    if (used + damaged <= 0) {
      this.notify(
        'Used or Damaged quantity is required',
        'error'
      );
      return;
    }

    if (used + damaged > a.allocated_quantity) {
      this.notify(
        'Used + Damaged exceeds allocated quantity',
        'error'
      );
      return;
    }

    const returned =
      a.allocated_quantity - used;

    const ok = window.confirm(
      `Confirm usage & return?\n\n` +
      `Allocated : ${a.allocated_quantity}\n` +
      `Used      : ${used}\n` +
      `Damaged   : ${damaged}\n` +
      `Returned  : ${returned}`
    );

    if (!ok) return;

    this.loading = true;

    // ============================
    // STEP 1: USED
    // ============================

    this.http.post(`${environment.apiUrl}/materials/usage`, {
      allocation_id: a.allocation_id,
      quantity: used,
      usage_type: 'USED',
      remarks: null
    }).subscribe({

      next: () => {

        const damaged$ =
          damaged > 0
            ? this.http.post(
                `${environment.apiUrl}/materials/usage`,
                {
                  allocation_id: a.allocation_id,
                  quantity: damaged,
                  usage_type: 'DAMAGED',
                  remarks: null
                }
              )
            : null;

        const proceedToReturn = () => {

          // ============================
          // STEP 3: RETURN
          // ============================

          this.http.post(
            `${environment.apiUrl}/materials/return/${a.allocation_id}`,
            {}
          ).subscribe({

            next: () => {
              this.notify(
                'Usage recorded & materials returned'
              );
              this.loadAllocations();
            },

            error: () => {
              this.notify('Return failed', 'error');
              this.loading = false;
            },

            complete: () => {
              this.loading = false;
            }

          });
        };

        if (damaged$) {
          damaged$.subscribe({
            next: proceedToReturn,
            error: () => {
              this.notify(
                'Damaged usage failed',
                'error'
              );
              this.loading = false;
            }
          });
        } else {
          proceedToReturn();
        }
      },

      error: () => {
        this.notify(
          'Usage recording failed',
          'error'
        );
        this.loading = false;
      }

    });
  }
}
