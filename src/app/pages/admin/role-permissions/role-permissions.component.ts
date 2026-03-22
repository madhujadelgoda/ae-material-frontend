import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { AdminRolePermissionService } from '../../../core/services/admin-role-permission.service';


interface Role {
  role_id: number;
  role_name: string;
}

interface Permission {
  permission_id: number;
  permission_key: string;
}

@Component({
  standalone: true,
  selector: 'app-role-permissions',
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule   // THIS FIXES EVERYTHING
  ],
  templateUrl: './role-permissions.component.html'
})

export class RolePermissionsComponent implements OnInit {

  roles: Role[] = [];
  permissions: Permission[] = [];

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

  /* =============================
     LOAD ROLES
  ============================= */

  loadRoles(): void {

    this.rolePermissionService
      .getRolesForAssignment()
      .subscribe(data => {
        this.roles = data;
      });

  }

  /* =============================
     LOAD PERMISSIONS
  ============================= */

  loadPermissions(): void {

    this.permissionService
      .getPermissions()
      .subscribe(data => {
        this.permissions = data;
      });

  }

  /* =============================
     ROLE SELECTED
  ============================= */

  onRoleSelect(roleId: number): void {

    if (!roleId) return;

    this.selectedRoleId = roleId;
    this.selectedPermissionIds = [];
    this.loading = true;

    this.rolePermissionService
      .getRolePermissions(roleId)
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
        this.selectedPermissionIds.filter(
          id => id !== permissionId
        );

    } else {

      this.selectedPermissionIds.push(permissionId);

    }

  }

  selectAll(perms: Permission[]): void {

    perms.forEach(p => {

      if (!this.selectedPermissionIds.includes(p.permission_id)) {
        this.selectedPermissionIds.push(p.permission_id);
      }

    });

  }

  clearAll(perms: Permission[]): void {

    this.selectedPermissionIds =
      this.selectedPermissionIds.filter(
        id => !perms.some(p => p.permission_id === id)
      );

  }

  /* =============================
     SAVE
  ============================= */

  save(): void {

    if (!this.selectedRoleId) return;

    this.loading = true;

    this.rolePermissionService
      .updateRolePermissions(
        this.selectedRoleId,
        this.selectedPermissionIds
      )
      .subscribe({
        next: () => {

          alert('Permissions updated successfully');
          this.loading = false;

        },
        error: () => {

          alert('Failed to update permissions');
          this.loading = false;

        }
      });

  }

  /* =========================
     UI HELPERS
  ========================= */

  get filteredPermissions(): Permission[] {

    return this.permissions.filter(p =>
      p.permission_key
        .toLowerCase()
        .includes(this.search.toLowerCase())
    );

  }

  get groupedPermissions(): [string, Permission[]][] {

    const groups: Record<string, Permission[]> = {};

    for (const p of this.filteredPermissions) {

      const group = p.permission_key.split('.')[0];

      groups[group] ??= [];
      groups[group].push(p);

    }

    return Object.entries(groups);

  }
}
