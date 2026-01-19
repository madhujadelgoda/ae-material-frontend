import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminUserService {

  private base = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  // ======================
  // USERS
  // ======================
  getUsers() {
    return this.http.get<any[]>(this.base);
  }

  createUser(payload: {
    username: string;
    password: string;
    full_name?: string;
    role_ids: number[];
  }) {
    return this.http.post(this.base, payload);
  }

  updateUser(
    id: number,
    payload: {
      full_name?: string;
      role_ids: number[];
    }
  ) {
    return this.http.put(`${this.base}/${id}`, payload);
  }

  updateStatus(id: number, status: 'ACTIVE' | 'INACTIVE') {
    return this.http.put(`${this.base}/${id}/status/${status}`, {});
  }

  resetPassword(id: number, password: string) {
    return this.http.post(`${this.base}/${id}/reset-password`, {
      password
    });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
