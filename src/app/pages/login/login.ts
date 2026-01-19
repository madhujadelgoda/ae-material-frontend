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
  username = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';

    this.auth.login(this.username, this.password).subscribe({
      next: res => {
        // Store ONLY the JWT
        StorageService.setToken(res.access_token);

        // Roles & permissions are read from JWT payload
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.error = err.error?.detail || 'Invalid credentials';
      }
    });
  }
}
