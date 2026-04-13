import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { environment } from '../../../environments/environment';

import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { StorageService } from '../../core/services/storage.service';

interface BulkItem {
  material_code: string | null;
  quantity: number | null;
}

@Component({
  standalone: true,
  selector: 'app-bulk-allocate',
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    HasPermissionDirective
  ],
  templateUrl: './bulk-allocate.html'
})
export class BulkAllocateComponent implements OnInit {
  trackByRowIndex(index: number, _row: BulkItem): number {
    return index;
  }

  getMaterialRemaining(materialCode: string | null, rowIndex: number): number {
    return this.remainingForRow(materialCode, rowIndex);
  }

  getMaterialRemainingLabel(materialCode: string | null, rowIndex: number): string {
    const remaining = this.getMaterialRemaining(materialCode, rowIndex);
    return remaining.toString();
  }

  teams: any[] = [];
  materials: any[] = [];
  locator: any;

  selectedTeamId: number | null = null;
  rows: BulkItem[] = [];

  loading = false;
  error = '';
  success = '';

  /** permission */
  canBulkAllocate = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {

    this.canBulkAllocate =
      StorageService.hasPermission('material.allocate.bulk');

    this.loadTeams();
    this.loadLocator();
    this.loadMaterials();
    this.addRow();
  }

  // ------------------------
  // Load base data
  // ------------------------

  loadTeams() {
    this.http
      .get<any[]>(`${environment.apiUrl}/teams`)
      .subscribe(data => this.teams = data);
  }

  loadLocator() {
    this.http
      .get(`${environment.apiUrl}/erp/locator`)
      .subscribe(data => this.locator = data);
  }

  loadMaterials() {
    this.http
      .get<any[]>(`${environment.apiUrl}/materials/available`)
      .subscribe(data => this.materials = data);
  }

  // ------------------------
  // Rows
  // ------------------------

  addRow() {

    if (!this.canBulkAllocate) return;

    this.rows.push({
      material_code: null,
      quantity: null
    });
  }

  removeRow(index: number) {

    if (!this.canBulkAllocate) return;

    this.rows.splice(index, 1);
  }

  getMaterial(code: string | null) {
    return this.materials.find(m => m.erp_code === code);
  }

  usedQuantity(materialCode: string | null, currentIndex: number): number {

    if (!materialCode) return 0;

    return this.rows
      .filter((r, i) =>
        i !== currentIndex && r.material_code === materialCode
      )
      .reduce((sum, r) => sum + (r.quantity || 0), 0);
  }

  remainingForRow(materialCode: string | null, rowIndex: number): number {

    const mat = this.getMaterial(materialCode);
    if (!mat) return 0;

    const used = this.usedQuantity(materialCode, rowIndex);

    return Math.max(mat.remaining_quantity - used, 0);
  }

  // ------------------------
  // Submit
  // ------------------------

  submit() {

    if (!this.canBulkAllocate) return;

    this.error = '';
    this.success = '';

    if (!this.selectedTeamId) {
      this.error = 'Please select a team';
      return;
    }

    if (!this.rows.length) {
      this.error = 'Add at least one material';
      return;
    }

    const items: { material_code: string; quantity: number }[] = [];

    for (let i = 0; i < this.rows.length; i++) {

      const row = this.rows[i];

      if (!row.material_code || !row.quantity || row.quantity <= 0) {
        this.error = 'Each row must have material and quantity';
        return;
      }

      const remaining = this.remainingForRow(row.material_code, i);

      if (row.quantity > remaining) {
        this.error = `Not enough stock for ${row.material_code}`;
        return;
      }

      items.push({
        material_code: row.material_code,
        quantity: row.quantity
      });
    }

    this.loading = true;

    this.http.post(`${environment.apiUrl}/materials/allocate-bulk`, {
      team_id: this.selectedTeamId,
      items
    }).subscribe({
      next: () => {
        this.success = 'Materials allocated successfully';

        this.rows = [];
        this.addRow();
        this.loadMaterials();
      },
      error: err => {
        this.error =
          err.error?.detail || 'Bulk allocation failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
