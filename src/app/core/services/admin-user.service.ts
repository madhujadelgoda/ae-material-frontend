import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private base = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(this.base);
  }

  createUser(payload: any) {
    return this.http.post(this.base, payload);
  }

  updateUser(id: number, payload: any) {
    return this.http.patch(`${this.base}/${id}`, payload);
  }

  updateStatus(id: number, status: string) {
    return this.http.patch(`${this.base}/${id}/status`, { status });
  }

  updateRoles(id: number, roles: string[]) {
    return this.http.patch(`${this.base}/${id}/roles`, { roles });
  }

  resetPassword(id: number, new_password: string) {
    return this.http.patch(`${this.base}/${id}/reset-password`, {
      new_password
    });
  }

  deleteUser(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
