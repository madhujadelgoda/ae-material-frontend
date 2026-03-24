import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

interface PermissionRow {
  permission_id: number;
  permission_key: string;
  description: string | null;
}

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

  permissions: PermissionRow[] = [];

  // create / edit
  key = '';
  desc = '';

  editing: PermissionRow | null = null;

  loading = false;
  error = '';
  creating = false;
  savingEdit = false;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private permService: AdminPermissionService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  /* ===========================
     LOAD
  ============================ */

  load(): void {

    this.loading = true;

    this.permService.getPermissions().subscribe({
      next: data => {
        this.permissions = data;
        this.ensureValidPage();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load permissions';
        this.loading = false;
      }
    });
  }

  /* ===========================
     CREATE
  ============================ */

  create(): void {

    if (!this.canCreatePermission || this.creating) return;

    this.creating = true;

    this.permService
      .createPermission(this.key, this.desc)
      .subscribe({
        next: () => {
          this.key = '';
          this.desc = '';
          this.creating = false;
          this.load();
        },
        error: () => {
          this.creating = false;
          alert('Failed to create permission');
        }
      });
  }

  /* ===========================
     EDIT
  ============================ */

  startEdit(p: PermissionRow): void {
    this.editing = p;
    this.desc = p.description || '';
  }

  cancelEdit(): void {
    this.editing = null;
    this.desc = '';
  }

  saveEdit(): void {

    if (!this.editing || this.savingEdit) return;

    this.savingEdit = true;

    this.permService
      .updatePermission(
        this.editing.permission_id,
        this.desc
      )
      .subscribe({
        next: () => {
          this.savingEdit = false;
          this.cancelEdit();
          this.load();
        },
        error: () => {
          this.savingEdit = false;
          alert('Failed to update permission');
        }
      });
  }

  get canCreatePermission(): boolean {
    return this.key.trim().length > 0;
  }

  /* ===========================
     DELETE
  ============================ */

  delete(p: PermissionRow): void {

    if (!confirm(`Delete permission ${p.permission_key}?`)) return;

    this.permService
      .deletePermission(p.permission_id)
      .subscribe(() => this.load());
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.permissions.length / this.pageSize));
  }

  get paginatedPermissions(): PermissionRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.permissions.slice(start, start + this.pageSize);
  }

  get startItem(): number {
    if (this.permissions.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.permissions.length);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(total, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    const pages: number[] = [];

    for (let i = adjustedStart; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = Number(size) || 10;
    this.currentPage = 1;
    this.ensureValidPage();
  }

  private ensureValidPage(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }
}
