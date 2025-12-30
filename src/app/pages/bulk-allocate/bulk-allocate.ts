import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface BulkItem {
  material_code: string;
  quantity: number | null;
}

@Component({
  standalone: true,
  selector: 'app-bulk-allocate',
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-allocate.html'
})
export class BulkAllocateComponent implements OnInit {

  teams: any[] = [];
  materials: any[] = [];
  locator: any;

  selectedTeamId: number | null = null;

  rows: BulkItem[] = [];

  loading = false;
  error = '';
  success = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTeams();
    this.loadLocator();
    this.loadMaterials();
    this.addRow();
  }

  // -----------------------------
  // Load base data
  // -----------------------------
  loadTeams() {
    this.http.get<any[]>(`${environment.apiUrl}/teams`)
      .subscribe(data => this.teams = data);
  }

  loadLocator() {
    this.http.get(`${environment.apiUrl}/erp/locator`)
      .subscribe(data => this.locator = data);
  }

  loadMaterials() {
    this.http.get<any[]>(`${environment.apiUrl}/materials/available`)
      .subscribe(data => this.materials = data);
  }

  // -----------------------------
  // Row helpers
  // -----------------------------
  addRow() {
    this.rows.push({
      material_code: '',
      quantity: null
    });
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
  }

  getMaterial(code: string) {
    return this.materials.find(m => m.material_code === code);
  }

  /** how much already used in other rows */
  usedQuantity(materialCode: string, currentIndex: number): number {
    return this.rows
      .filter((r, i) => i !== currentIndex && r.material_code === materialCode)
      .reduce((sum, r) => sum + (r.quantity || 0), 0);
  }

  /** remaining quantity considering other rows */
  remainingForRow(materialCode: string, rowIndex: number): number {
    const mat = this.getMaterial(materialCode);
    if (!mat) return 0;

    const used = this.usedQuantity(materialCode, rowIndex);
    return Math.max(mat.remaining_quantity - used, 0);
  }

  /** disable already-selected materials */
  isMaterialDisabled(materialCode: string, rowIndex: number): boolean {
    return this.rows.some(
      (row, idx) =>
        idx !== rowIndex && row.material_code === materialCode
    );
  }

  // -----------------------------
  // Submit bulk allocation
  // -----------------------------
  submit() {
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
      locator_id: this.locator.locator_id,
      items
    }).subscribe({
      next: () => {
        this.success = 'Materials allocated successfully';
        this.rows = [];
        this.addRow();
        this.loadMaterials();
      },
      error: err => {
        this.error = err.error?.message || 'Bulk allocation failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
