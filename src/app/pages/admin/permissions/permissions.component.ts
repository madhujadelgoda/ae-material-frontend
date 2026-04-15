import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { AdminPermissionService } from '../../../core/services/admin-permission.service';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

interface PermissionRow {
  permission_id: number;
  permission_key: string;
  description: string | null;
}

interface PermissionFeedback {
  type: 'success' | 'error';
  message: string;
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

  createKey = '';
  createDescription = '';
  editPermissionId: number | null = null;
  editDescription = '';

  loading = false;
  error = '';
  feedback: PermissionFeedback | null = null;
  creating = false;
  savingEdit = false;
  deletingPermissionId: number | null = null;
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
    this.error = '';
    this.loading = true;

    this.permService
      .getPermissions()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: data => {
          this.permissions = data;

          if (
            this.editPermissionId !== null &&
            !data.some(permission => permission.permission_id === this.editPermissionId)
          ) {
            this.cancelEdit();
          }

          this.ensureValidPage();
        },
        error: error => {
          this.error = this.getErrorMessage(error, 'Failed to load permissions');
        }
      });
  }

  /* ===========================
     CREATE
  ============================ */

  create(): void {
    if (!this.canCreatePermission || this.creating) return;

    this.clearFeedback();
    this.creating = true;

    this.permService
      .createPermission(this.normalizedCreateKey, this.normalizedCreateDescription)
      .pipe(finalize(() => this.creating = false))
      .subscribe({
        next: () => {
          this.resetCreateForm();
          this.setFeedback('success', 'Permission created successfully');
          this.load();
        },
        error: error => {
          this.setFeedback('error', this.getErrorMessage(error, 'Failed to create permission'));
        }
      });
  }

  /* ===========================
     EDIT
  ============================ */

  startEdit(p: PermissionRow): void {
    this.clearFeedback();
    this.editPermissionId = p.permission_id;
    this.editDescription = p.description ?? '';
  }

  cancelEdit(): void {
    this.editPermissionId = null;
    this.editDescription = '';
  }

  saveEdit(): void {
    if (this.editPermissionId === null || this.savingEdit || !this.hasEditChanges) return;

    const permissionId = this.editPermissionId;
    const description = this.normalizedEditDescription;

    this.clearFeedback();
    this.savingEdit = true;

    this.permService
      .updatePermission(permissionId, description)
      .pipe(finalize(() => this.savingEdit = false))
      .subscribe({
        next: () => {
          this.permissions = this.permissions.map(permission =>
            permission.permission_id === permissionId
              ? { ...permission, description }
              : permission
          );

          this.cancelEdit();
          this.setFeedback('success', 'Permission updated successfully');
        },
        error: error => {
          this.setFeedback('error', this.getErrorMessage(error, 'Failed to update permission'));
        }
      });
  }

  get canCreatePermission(): boolean {
    return this.normalizedCreateKey.length > 0;
  }

  get hasEditChanges(): boolean {
    const permission = this.editingPermission;

    if (!permission) {
      return false;
    }

    return (permission.description ?? '') !== this.normalizedEditDescription;
  }

  /* ===========================
     DELETE
  ============================ */

  delete(p: PermissionRow): void {
    if (this.deletingPermissionId !== null) return;
    if (!confirm(`Delete permission ${p.permission_key}?`)) return;

    this.clearFeedback();
    this.deletingPermissionId = p.permission_id;

    this.permService
      .deletePermission(p.permission_id)
      .pipe(finalize(() => this.deletingPermissionId = null))
      .subscribe({
        next: () => {
          this.permissions = this.permissions.filter(
            permission => permission.permission_id !== p.permission_id
          );

          if (this.editPermissionId === p.permission_id) {
            this.cancelEdit();
          }

          this.ensureValidPage();
          this.setFeedback('success', 'Permission deleted successfully');
        },
        error: error => {
          this.setFeedback('error', this.getErrorMessage(error, 'Failed to delete permission'));
        }
      });
  }

  get editingPermission(): PermissionRow | null {
    if (this.editPermissionId === null) {
      return null;
    }

    return this.permissions.find(
      permission => permission.permission_id === this.editPermissionId
    ) ?? null;
  }

  get normalizedCreateKey(): string {
    return this.createKey.trim().toLowerCase();
  }

  get normalizedCreateDescription(): string {
    return this.normalizeText(this.createDescription);
  }

  get normalizedEditDescription(): string {
    return this.normalizeText(this.editDescription);
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

  isEditing(permission: PermissionRow): boolean {
    return this.editPermissionId === permission.permission_id;
  }

  trackByPermissionId(_: number, permission: PermissionRow): number {
    return permission.permission_id;
  }

  private resetCreateForm(): void {
    this.createKey = '';
    this.createDescription = '';
  }

  private clearFeedback(): void {
    this.feedback = null;
  }

  private setFeedback(type: PermissionFeedback['type'], message: string): void {
    this.feedback = { type, message };
  }

  private normalizeText(value: string): string {
    return value.trim();
  }

  private getErrorMessage(error: any, fallback: string): string {
    return error?.error?.detail || error?.error?.message || fallback;
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
