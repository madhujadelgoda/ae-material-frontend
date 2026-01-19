import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminUserService } from '../../../core/services/admin-user.service';

@Component({
  standalone: true,
  selector: 'app-reset-password-modal',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop">
      <div class="modal-card">

        <h3>Reset Password</h3>
        <p>User: <b>{{ user?.username }}</b></p>

        <input
          type="password"
          placeholder="New password"
          [(ngModel)]="password"
        />

        <div class="modal-actions">
          <button class="btn ghost" (click)="close.emit()">Cancel</button>
          <button class="btn danger" (click)="reset()">Reset</button>
        </div>

      </div>
    </div>
  `
})
export class ResetPasswordModalComponent {

  @Input() user: any;
  @Output() close = new EventEmitter<void>();
  @Output() done = new EventEmitter<void>();

  password = '';

  constructor(private service: AdminUserService) {}

  reset() {
    if (!this.password) return;

    this.service
      .resetPassword(this.user.user_id, this.password)
      .subscribe(() => this.done.emit());
  }
}
