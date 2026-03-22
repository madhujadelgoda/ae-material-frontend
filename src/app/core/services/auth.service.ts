import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.base}/login`, {
      username,
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
