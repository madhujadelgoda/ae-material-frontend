import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminRoleService {
  private base = `${environment.apiUrl}/admin/roles/`;

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get<any[]>(this.base);
  }

  createRole(role_name: string, description: string | null) {
    return this.http.post(this.base, { role_name, description });
  }

  updateRole(role_id: number, description: string | null) {
    return this.http.put(`${this.base}${role_id}`, { description });
  }

  deleteRole(role_id: number) {
    return this.http.delete(`${this.base}${role_id}`);
  }
}
