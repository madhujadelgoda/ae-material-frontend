import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminUserService } from '../../../core/services/admin-user.service';

@Component({
  standalone: true,
  selector: 'app-user-form-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop">
      <div class="modal-card">

        <h3>{{ user ? 'Edit User' : 'Create User' }}</h3>

        <div class="form-group">
          <label>Username</label>
          <input
            type="text"
            [(ngModel)]="form.username"
            [disabled]="!!user"
          />
        </div>

        <div class="form-group">
          <label>Full Name</label>
          <input
            type="text"
            [(ngModel)]="form.full_name"
          />
        </div>

        <div class="form-group" *ngIf="!user">
          <label>Password</label>
          <input
            type="password"
            [(ngModel)]="form.password"
          />
        </div>

        <div class="form-group">
          <label>Roles</label>
          <select multiple [(ngModel)]="form.role_ids">
            <option [value]="1">ADMIN</option>
            <option [value]="2">AE</option>
          </select>
        </div>

        <div class="modal-actions">
          <button class="btn ghost" (click)="close.emit()">Cancel</button>
          <button class="btn primary" (click)="save()">Save</button>
        </div>

      </div>
    </div>
  `
})
export class UserFormModalComponent {

  @Input() user: any;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form: any = {
    username: '',
    full_name: '',
    password: '',
    role_ids: []
  };

  constructor(private service: AdminUserService) {}

  ngOnInit() {
    if (this.user) {
      this.form.username = this.user.username;
      this.form.full_name = this.user.full_name;
      this.form.role_ids = this.user.role_ids || [];
    }
  }

  save() {
    if (this.user) {
      this.service
        .updateUser(this.user.user_id, {
          full_name: this.form.full_name,
          role_ids: this.form.role_ids
        })
        .subscribe(() => this.saved.emit());
    } else {
      this.service
        .createUser(this.form)
        .subscribe(() => this.saved.emit());
    }
  }
}
