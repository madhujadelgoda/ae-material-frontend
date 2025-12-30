import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { StorageService } from '../../core/services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  templateUrl: './login.html'
})
export class LoginComponent {
  userId = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.auth.login(this.userId, this.password).subscribe({
      next: res => {
        StorageService.setToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error?.message || 'Login failed';
      }
    });
  }
}
