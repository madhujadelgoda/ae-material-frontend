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
}
