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

        <h3 class="modal-title">
          {{ user ? 'Edit User' : 'Create User' }}
        </h3>

        <div class="form-group">
          <label>Username</label>
          <input
            type="text"
            [(ngModel)]="form.username"
            placeholder="Enter username"
          />
        </div>

        <div class="form-group">
          <label>Full Name</label>
          <input
            type="text"
            [(ngModel)]="form.full_name"
            placeholder="Enter full name"
          />
        </div>

        <div class="form-group" *ngIf="!user">
          <label>Password</label>
          <input
            type="password"
            [(ngModel)]="form.password"
            placeholder="Set password"
          />
        </div>

        <div class="form-group">
          <label>Roles</label>
          <select multiple [(ngModel)]="form.roles">
            <option value="ADMIN">ADMIN</option>
            <option value="AE">AE</option>
          </select>
          <small class="hint">Hold Ctrl / Cmd to select multiple</small>
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
    roles: []
  };

  constructor(private service: AdminUserService) {}

  ngOnInit() {
    if (this.user) {
      this.form.username = this.user.username;
      this.form.full_name = this.user.full_name;
      this.form.roles = this.user.roles?.split(',') || [];
    }
  }

  save() {
    if (this.user) {
      this.service
        .updateUser(this.user.user_id, {
          username: this.form.username,
          full_name: this.form.full_name
        })
        .subscribe(() => {
          this.service
            .updateRoles(this.user.user_id, this.form.roles)
            .subscribe(() => this.saved.emit());
        });
    } else {
      this.service.createUser(this.form).subscribe(() => {
        this.saved.emit();
      });
    }
  }
}
