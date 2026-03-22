import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from '../../../environments/environment';

import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { StorageService } from '../../core/services/storage.service';

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

  allocations: any[] = [];

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
      .get<any[]>(`${environment.apiUrl}/materials/allocations`)
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

  isLocked(a: any): boolean {
    return a.status === 'RETURNED';
  }

  // ============================
  // RETURN PREVIEW
  // ============================

  returnedQty(a: any): number | null {

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

  submitUsageAndReturn(a: any): void {

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
