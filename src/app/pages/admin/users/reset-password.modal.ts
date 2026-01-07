import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../core/services/admin-user.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-reset-password-modal',
  template: `
  <div class="modal-backdrop">
    <div class="modal">
      <h3>Reset Password</h3>

      <p>User: <b>{{ user?.username }}</b></p>

      <input
        type="password"
        placeholder="New password"
        [(ngModel)]="password"
      />

      <div class="actions">
        <button class="btn" (click)="close.emit()">Cancel</button>
        <button class="btn danger" (click)="reset()">Reset</button>
      </div>
    </div>
  </div>
  `
})
export class ResetPasswordModalComponent {

  @Input() user: any;
  @Output() close = new EventEmitter();
  @Output() done = new EventEmitter();

  password = '';

  constructor(private service: AdminUserService) {}

  reset() {
    this.service.resetPassword(this.user.user_id, this.password)
      .subscribe(() => this.done.emit());
  }
}
