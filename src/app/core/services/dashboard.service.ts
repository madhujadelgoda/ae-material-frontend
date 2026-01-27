import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardSummary {
  totalMaterials: number;
  totalTeams: number;
  totalAllocations: number;
  activeAllocations: number;
  returnedToday: number;
  todayAllocations: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private base = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${this.base}/summary`
    );
  }
}
