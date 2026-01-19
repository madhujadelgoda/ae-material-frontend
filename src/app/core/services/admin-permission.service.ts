// src/app/core/services/admin-permission.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminPermissionService {
  private base = `${environment.apiUrl}/admin/permissions`;

  constructor(private http: HttpClient) {}

  getPermissions() {
    return this.http.get<any[]>(this.base);
  }

  createPermission(permission_key: string, description: string) {
    return this.http.post(this.base, {
      permission_key,
      description
    });
  }

  updatePermission(permission_id: number, description: string) {
    return this.http.put(`${this.base}/${permission_id}`, {
      description
    });
  }

  deletePermission(permission_id: number) {
    return this.http.delete(`${this.base}/${permission_id}`);
  }
}
