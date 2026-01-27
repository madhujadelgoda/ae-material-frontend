import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HasPermissionDirective 
  ],
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent implements OnInit {

  permissions: any[] = [];

  // create / edit
  key = '';
  desc = '';
  editing: any = null;

  loading = false;
  error = '';

  constructor(private permService: AdminPermissionService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.permService.getPermissions().subscribe({
      next: data => {
        this.permissions = data;
      },
      error: () => {
        this.error = 'Failed to load permissions';
      }
    });
  }

  create(): void {
    if (!this.key.trim()) return;

    this.permService.createPermission(this.key, this.desc).subscribe(() => {
      this.key = '';
      this.desc = '';
      this.load();
    });
  }

  startEdit(p: any): void {
    this.editing = p;
    this.desc = p.description;
  }

  cancelEdit(): void {
    this.editing = null;
    this.desc = '';
  }

  saveEdit(): void {
    this.permService
      .updatePermission(this.editing.permission_id, this.desc)
      .subscribe(() => {
        this.cancelEdit();
        this.load();
      });
  }

  delete(p: any): void {
    if (!confirm(`Delete permission ${p.permission_key}?`)) return;

    this.permService
      .deletePermission(p.permission_id)
      .subscribe(() => this.load());
  }
}
