import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(userId: string, password: string) {
    return this.http.post<any>(`${this.base}/login`, {
      userId,
      password
    });
  }

  logout() {
    StorageService.clear();
  }

  isLoggedIn(): boolean {
    return !!StorageService.getToken();
  }
}
