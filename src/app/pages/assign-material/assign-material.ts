import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { environment } from '../../../environments/environment';
import { MaterialService } from '../../core/services/material.service';

import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { StorageService } from '../../core/services/storage.service';

@Component({
  standalone: true,
  selector: 'app-assign-material',
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    HasPermissionDirective 
  ],
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

  /** permission flag */
  canAssign = false;

  constructor(
    private http: HttpClient,
    private materialService: MaterialService
  ) {}

  ngOnInit(): void {

    // read permission once
    this.canAssign = StorageService.hasPermission('material.assign');

    this.loadTeams();
    this.loadLocator();
  }

  // -------------------------
  // Load teams
  // -------------------------
  loadTeams() {
    this.http.get<any[]>(`${environment.apiUrl}/teams`).subscribe({
      next: data => (this.teams = data),
      error: () => (this.error = 'Failed to load teams')
    });
  }

  // -------------------------
  // Load locator
  // -------------------------
  loadLocator() {
    this.http.get(`${environment.apiUrl}/erp/locator`).subscribe({
      next: data => (this.locator = data),
      error: () => (this.error = 'Failed to load locator')
    });
  }

  // -------------------------
  // When team changes
  // -------------------------
  onTeamSelected() {

    if (!this.canAssign) return;

    this.selectedMaterial = null;
    this.quantity = null;

    if (!this.selectedTeamId) {
      this.materials = [];
      return;
    }

    this.materialService.getAvailableMaterials().subscribe({
      next: data => (this.materials = data),
      error: () => (this.error = 'Failed to load materials')
    });
  }

  // -------------------------
  // Submit allocation
  // -------------------------
  submit() {

    if (!this.canAssign) return;

    this.error = '';
    this.success = '';

    if (!this.selectedTeamId) {
      this.error = 'Please select a team first';
      return;
    }

    if (!this.selectedMaterial || !this.quantity) {
      this.error = 'Material and quantity are required';
      return;
    }

    if (this.quantity <= 0) {
      this.error = 'Quantity must be greater than zero';
      return;
    }

    if (this.quantity > this.selectedMaterial.remaining_quantity) {
      this.error =
        `Only ${this.selectedMaterial.remaining_quantity}
         ${this.selectedMaterial.erp_uom} available`;
      return;
    }

    this.loading = true;

    this.materialService.allocate({
      team_id: this.selectedTeamId,
      material_code: this.selectedMaterial.erp_code,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.success = 'Material allocated successfully';

        this.quantity = null;
        this.selectedMaterial = null;

        this.onTeamSelected();
      },
      error: err => {
        this.error = err.error?.detail || 'Allocation failed';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
