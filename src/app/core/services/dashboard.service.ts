import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(
      `${environment.apiUrl}/dashboard/summary`
    );
  }
}
