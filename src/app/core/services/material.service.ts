import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private base = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) {}

  // Allocate material to a team
  allocate(payload: {
    team_id: number;
    locator_id: number;
    material_code: string;
    quantity: number;
  }) {
    return this.http.post(`${this.base}/allocate`, payload);
  }

  // Get available materials with remaining quantity
  getAvailableMaterials() {
    return this.http.get<any[]>(`${this.base}/available`);
  }
}
