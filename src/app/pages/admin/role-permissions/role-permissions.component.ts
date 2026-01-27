import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { AdminRolePermissionService } from '../../../core/services/admin-role-permission.service';

@Component({
  standalone: true,
  selector: 'app-role-permissions',
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permissions.component.html'
})
export class RolePermissionsComponent implements OnInit {

  roles: any[] = [];
  permissions: any[] = [];

  selectedRoleId: number | null = null;
  selectedPermissionIds: number[] = [];

  search = '';
  loading = false;

  constructor(
    private permissionService: AdminPermissionService,
    private rolePermissionService: AdminRolePermissionService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  // =============================
  // ROLES FOR ASSIGNMENT (NEW)
  // =============================
  loadRoles(): void {
    this.rolePermissionService
      .getRolesForAssignment()
      .subscribe(data => {
        this.roles = data;
      });
  }

  // =============================
  // ALL PERMISSIONS
  // =============================
  loadPermissions(): void {
    this.permissionService
      .getPermissions()
      .subscribe(data => {
        this.permissions = data;
      });
  }

  // =============================
  // ROLE SELECTED
  // =============================
  onRoleSelect(roleId: string): void {

    this.selectedRoleId = Number(roleId);
    this.selectedPermissionIds = [];
    this.loading = true;

    this.rolePermissionService
      .getRolePermissions(this.selectedRoleId)
      .subscribe({
        next: data => {
          this.selectedPermissionIds =
            data.map(p => p.permission_id);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Failed to load role permissions');
        }
      });
  }

  /* =========================
     PERMISSION LOGIC
  ========================= */

  togglePermission(permissionId: number): void {
    if (this.selectedPermissionIds.includes(permissionId)) {
      this.selectedPermissionIds =
        this.selectedPermissionIds.filter(id => id !== permissionId);
    } else {
      this.selectedPermissionIds.push(permissionId);
    }
  }

  selectAll(perms: any[]): void {
    perms.forEach(p => {
      if (!this.selectedPermissionIds.includes(p.permission_id)) {
        this.selectedPermissionIds.push(p.permission_id);
      }
    });
  }

  clearAll(perms: any[]): void {
    this.selectedPermissionIds =
      this.selectedPermissionIds.filter(
        id => !perms.some(p => p.permission_id === id)
      );
  }

  // =============================
  // SAVE
  // =============================
  save(): void {

    if (!this.selectedRoleId) return;

    this.rolePermissionService
      .updateRolePermissions(
        this.selectedRoleId,
        this.selectedPermissionIds
      )
      .subscribe({
        next: () => alert('Permissions updated successfully'),
        error: () => alert('Failed to update permissions')
      });
  }

  /* =========================
     UI HELPERS
  ========================= */

  get filteredPermissions() {
    return this.permissions.filter(p =>
      p.permission_key
        .toLowerCase()
        .includes(this.search.toLowerCase())
    );
  }

  get groupedPermissions() {

    const groups: Record<string, any[]> = {};

    for (const p of this.filteredPermissions) {
      const group = p.permission_key.split('.')[0];
      groups[group] ??= [];
      groups[group].push(p);
    }

    return Object.entries(groups);
  }
}
