import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { FormsModule } from '@angular/forms';
import { UserFormModalComponent } from './user-form.modal';
import { ResetPasswordModalComponent } from './reset-password.modal';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormModalComponent, ResetPasswordModalComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  selectedUser: any = null;

  showForm = false;
  showReset = false;

  constructor(private userService: AdminUserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
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
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    this.userService.updateStatus(user.user_id, newStatus)
      .subscribe(() => this.loadUsers());
  }

  deleteUser(user: any) {
    if (!confirm(`Delete ${user.username}?`)) return;

    this.userService.deleteUser(user.user_id)
      .subscribe(() => this.loadUsers());
  }
}
