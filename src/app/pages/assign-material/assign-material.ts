import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MaterialService } from '../../core/services/material.service';

@Component({
  standalone: true,
  selector: 'app-assign-material',
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-material.html'
})
export class AssignMaterialComponent implements OnInit {

  teams: any[] = [];
  materials: any[] = [];
  locator: any;

  selectedTeamId: number | null = null;
  selectedMaterial: any = null;
  quantity: number | null = null;

  loading = false;
  success = '';
  error = '';

  constructor(
    private http: HttpClient,
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadLocator();
    this.loadAvailableMaterials();
  }

  // -------------------------
  // Load teams
  // -------------------------
  loadTeams() {
    this.http
      .get<any[]>(`${environment.apiUrl}/teams`)
      .subscribe({
        next: data => (this.teams = data),
        error: () => (this.error = 'Failed to load teams')
      });
  }

  // -------------------------
  // Load locator info
  // -------------------------
  loadLocator() {
    this.http
      .get(`${environment.apiUrl}/erp/locator`)
      .subscribe({
        next: data => (this.locator = data),
        error: () => (this.error = 'Failed to load locator')
      });
  }

  // -------------------------
  // Load materials with remaining qty
  // -------------------------
  loadAvailableMaterials() {
    this.materialService.getAvailableMaterials().subscribe({
      next: data => (this.materials = data),
      error: () => (this.error = 'Failed to load materials')
    });
  }

  // -------------------------
  // Submit allocation
  // -------------------------
  submit() {
    this.error = '';
    this.success = '';

    if (!this.selectedTeamId || !this.selectedMaterial || !this.quantity) {
      this.error = 'All fields are required';
      return;
    }

    if (this.quantity <= 0) {
      this.error = 'Quantity must be greater than zero';
      return;
    }

    if (this.quantity > this.selectedMaterial.remaining_quantity) {
      this.error = `Only ${this.selectedMaterial.remaining_quantity} ${this.selectedMaterial.uom} available`;
      return;
    }

    this.loading = true;

    this.materialService.allocate({
      team_id: this.selectedTeamId,
      locator_id: this.locator.locator_id,
      material_code: this.selectedMaterial.material_code,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.success = 'Material allocated successfully';

        // reset inputs
        this.quantity = null;
        this.selectedMaterial = null;

        // reload availability
        this.loadAvailableMaterials();
      },
      error: err => {
        this.error = err.error?.message || 'Allocation failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
