import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminRoleService {
  private base = `${environment.apiUrl}/admin/roles`;

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get<any[]>(this.base);
  }

  createRole(role_name: string, description: string) {
    return this.http.post(this.base, { role_name, description });
  }

  assignPermissions(role_id: number, permissions: string[]) {
    return this.http.post(`${this.base}/permissions`, {
      role_id,
      permissions
    });
  }
}
