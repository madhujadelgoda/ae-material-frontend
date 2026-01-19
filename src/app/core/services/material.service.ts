import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private baseUrl = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) {}

  // =========================
  // Allocate material to team
  // =========================
  allocate(payload: {
    team_id: number;
    material_code: string;
    quantity: number;
  }) {
    return this.http.post(`${this.baseUrl}/allocate`, payload);
  }

  // ==================================
  // Get available materials in locator
  // ==================================
  getAvailableMaterials() {
    return this.http.get<any[]>(`${this.baseUrl}/available`);
  }
}
