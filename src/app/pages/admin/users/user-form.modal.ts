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
      <div class="modal-card user-modal-card">

        <div class="user-modal-header">
          <div class="user-modal-title-wrap">
            <div class="user-modal-title-icon">
              <span class="material-symbols-rounded">
                {{ user ? 'edit_square' : 'person_add' }}
              </span>
            </div>
            <div>
              <h3 class="user-modal-title">{{ user ? 'Edit User' : 'Create User' }}</h3>
              <p class="user-modal-subtitle">
                {{ user ? 'Update profile details and role access' : 'Add a new user and grant access roles' }}
              </p>
            </div>
          </div>

          <button class="btn icon-btn" type="button" title="Close" (click)="close.emit()">
            <span class="material-symbols-rounded">close</span>
          </button>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="e.g. anusha.r"
              [(ngModel)]="form.username"
              [disabled]="!!user"
            />
            <span class="hint" *ngIf="!user">Use a unique login ID</span>
          </div>

          <div class="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Anusha R"
              [(ngModel)]="form.full_name"
            />
          </div>

          <div class="form-group" *ngIf="!user">
            <label>Password</label>
            <input
              type="password"
              placeholder="Set a temporary password"
              [(ngModel)]="form.password"
            />
            <span class="hint">Minimum 6 characters recommended</span>
          </div>

          <div class="form-group user-roles-field">
            <label>Roles</label>
            <select multiple [(ngModel)]="form.role_ids">
              <option [value]="1">ADMIN</option>
              <option [value]="2">AE</option>
            </select>
            <span class="hint">Hold Ctrl/Cmd to select multiple roles</span>
          </div>
        </div>

        <div class="modal-actions user-modal-actions">
          <button class="btn ghost" type="button" (click)="close.emit()">
            <span class="material-symbols-rounded btn-icon">close</span>
            Cancel
          </button>

          <button class="btn primary" type="button" [disabled]="!canSave || saving" (click)="save()">
            <span class="material-symbols-rounded btn-icon">{{ user ? 'save' : 'person_add' }}</span>
            {{ saving ? 'Saving...' : (user ? 'Save Changes' : 'Create User') }}
          </button>
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

  saving = false;

  get canSave(): boolean {
    const username = String(this.form.username || '').trim();
    const fullName = String(this.form.full_name || '').trim();
    const password = String(this.form.password || '').trim();
    const hasRoles = Array.isArray(this.form.role_ids) && this.form.role_ids.length > 0;

    if (this.user) {
      return fullName.length > 0 && hasRoles;
    }

    return username.length > 0 && fullName.length > 0 && password.length > 0 && hasRoles;
  }

  save() {
    if (!this.canSave || this.saving) {
      return;
    }

    this.saving = true;

    if (this.user) {
      this.service
        .updateUser(this.user.user_id, {
          full_name: this.form.full_name,
          role_ids: this.form.role_ids
        })
        .subscribe({
          next: () => this.saved.emit(),
          error: () => {
            alert('Failed to update user');
            this.saving = false;
          }
        });
    } else {
      this.service
        .createUser(this.form)
        .subscribe({
          next: () => this.saved.emit(),
          error: () => {
            alert('Failed to create user');
            this.saving = false;
          }
        });
    }
  }
}
