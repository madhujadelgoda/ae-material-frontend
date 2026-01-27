import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminUserService } from '../../../core/services/admin-user.service';
import { UserFormModalComponent } from './user-form.modal';
import { ResetPasswordModalComponent } from './reset-password.modal';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HasPermissionDirective,     // permission directive
    UserFormModalComponent,
    ResetPasswordModalComponent
  ],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  selectedUser: any = null;

  showForm = false;
  showReset = false;

  loading = false;

  constructor(private service: AdminUserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ============================
  // LOAD USERS
  // ============================

  loadUsers(): void {
    this.loading = true;

    this.service.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        alert('Failed to load users');
        this.loading = false;
      }
    });
  }

  // ============================
  // MODALS
  // ============================

  openCreate(): void {
    this.selectedUser = null;
    this.showForm = true;
  }

  openEdit(user: any): void {
    this.selectedUser = user;
    this.showForm = true;
  }

  openReset(user: any): void {
    this.selectedUser = user;
    this.showReset = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  closeReset(): void {
    this.showReset = false;
  }

  onSaved(): void {
    this.showForm = false;
    this.loadUsers();
  }

  onResetDone(): void {
    this.showReset = false;
  }

  // ============================
  // STATUS TOGGLE
  // ============================

  toggleStatus(user: any): void {

    const status =
      user.status === 'ACTIVE'
        ? 'INACTIVE'
        : 'ACTIVE';

    if (!confirm(`Change status to ${status}?`)) {
      return;
    }

    this.service
      .updateStatus(user.user_id, status)
      .subscribe({
        next: () => this.loadUsers(),
        error: () => alert('Failed to update status')
      });
  }

  // ============================
  // DELETE USER
  // ============================

  deleteUser(user: any): void {

    if (!confirm(`Delete ${user.username}?`)) return;

    this.service
      .deleteUser(user.user_id)
      .subscribe({
        next: () => this.loadUsers(),
        error: () => alert('Failed to delete user')
      });
  }

}
