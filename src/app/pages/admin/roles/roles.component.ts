import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoleService } from '../../../core/services/admin-role.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: r => this.roles = r,
      error: () => this.error = 'Failed to load roles'
    });
  }

  createRole() {
    if (!this.roleName.trim()) {
      this.error = 'Role name is required';
      return;
    }

    this.loading = true;
    this.error = '';

    this.roleService.createRole(this.roleName.trim(), this.description || null)
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

  startEdit(role: any) {
    this.editingRole = role;
    this.editDescription = role.description;
  }

  cancelEdit() {
    this.editingRole = null;
    this.editDescription = '';
  }

  saveEdit() {
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

  deleteRole(role: any) {
    if (!confirm(`Delete role "${role.role_name}"?`)) return;

    this.roleService.deleteRole(role.role_id).subscribe({
      next: () => this.loadRoles(),
      error: err => {
        alert(err.error?.detail || 'Cannot delete role');
      }
    });
  }
}
