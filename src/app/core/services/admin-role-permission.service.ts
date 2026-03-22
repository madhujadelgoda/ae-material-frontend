import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminRolePermissionService {

  // Correct router base
  private base = `${environment.apiUrl}/admin/role-permissions`;

  constructor(private http: HttpClient) {}

  // Roles for assignment screen
  getRolesForAssignment() {
    return this.http.get<any[]>(
      `${this.base}/roles-for-assignment`
    );
  }

  // Get permissions assigned to role
  getRolePermissions(roleId: number) {
    return this.http.get<any[]>(
      `${this.base}/${roleId}/permissions`
    );
  }

  // Replace permissions of role
  updateRolePermissions(
    roleId: number,
    permissionIds: number[]
  ) {
    return this.http.put(
      `${this.base}/${roleId}/permissions`,
      {
        permission_ids: permissionIds
      }
    );
  }
}
