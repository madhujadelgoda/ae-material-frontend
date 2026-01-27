import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoleService } from '../../../core/services/admin-role.service';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HasPermissionDirective 
  ],
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {

  roles: any[] = [];

  // create
  roleName = '';
  description = '';

  // edit
  editingRole: any = null;
  editDescription = '';

  loading = false;
  error = '';

  constructor(private roleService: AdminRoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  // ============================
  // LOAD ROLES
  // ============================

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: r => this.roles = r,
      error: () => this.error = 'Failed to load roles'
    });
  }

  // ============================
  // CREATE ROLE
  // ============================

  createRole(): void {

    if (!this.roleName.trim()) {
      this.error = 'Role name is required';
      return;
    }

    this.loading = true;
    this.error = '';

    this.roleService
      .createRole(this.roleName.trim(), this.description || null)
      .subscribe({
        next: () => {
          this.roleName = '';
          this.description = '';
          this.loadRoles();
        },
        error: err => {
          this.error = err.error?.detail || 'Failed to create role';
        },
        complete: () => this.loading = false
      });
  }

  // ============================
  // EDIT ROLE
  // ============================

  startEdit(role: any): void {
    this.editingRole = role;
    this.editDescription = role.description;
  }

  cancelEdit(): void {
    this.editingRole = null;
    this.editDescription = '';
  }

  saveEdit(): void {

    if (!this.editingRole) return;

    this.roleService.updateRole(
      this.editingRole.role_id,
      this.editDescription || null
    ).subscribe({
      next: () => {
        this.cancelEdit();
        this.loadRoles();
      },
      error: err => {
        this.error = err.error?.detail || 'Failed to update role';
      }
    });
  }

  // ============================
  // DELETE ROLE
  // ============================

  deleteRole(role: any): void {

    if (!confirm(`Delete role "${role.role_name}"?`)) return;

    this.roleService.deleteRole(role.role_id).subscribe({
      next: () => this.loadRoles(),
      error: err => {
        alert(err.error?.detail || 'Cannot delete role');
      }
    });
  }
}
