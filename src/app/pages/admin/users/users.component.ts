import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminUserService } from '../../../core/services/admin-user.service';
import { UserFormModalComponent } from './user-form.modal';
import { ResetPasswordModalComponent } from './reset-password.modal';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  constructor(private service: AdminUserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.service.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  openCreate() {
    this.selectedUser = null;
    this.showForm = true;
  }

  openEdit(user: any) {
    this.selectedUser = user;
    this.showForm = true;
  }

  openReset(user: any) {
    this.selectedUser = user;
    this.showReset = true;
  }

  onSaved() {
    this.showForm = false;
    this.loadUsers();
  }

  onResetDone() {
    this.showReset = false;
  }

  toggleStatus(user: any) {
    const status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    this.service
      .updateStatus(user.user_id, status)
      .subscribe(() => this.loadUsers());
  }

  deleteUser(user: any) {
    if (!confirm(`Delete ${user.username}?`)) return;

    this.service
      .deleteUser(user.user_id)
      .subscribe(() => this.loadUsers());
  }
}
