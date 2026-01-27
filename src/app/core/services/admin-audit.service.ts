import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminAuditService {
  private base = `${environment.apiUrl}/admin/audit`;

  constructor(private http: HttpClient) {}

  getOperationsAudit(limit = 50, offset = 0) {
    return this.http.get<any[]>(
      `${this.base}/operations?limit=${limit}&offset=${offset}`
    );
  }

  getSecurityAudit(limit = 50, offset = 0) {
    return this.http.get<any[]>(
      `${this.base}/security?limit=${limit}&offset=${offset}`
    );
  }
}
