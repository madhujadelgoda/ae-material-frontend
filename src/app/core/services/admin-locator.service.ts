import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/* ===============================
   INTERFACES
================================ */

export interface AdminLocator {
  locator_id: number;
  locator_code: string;
  warehouse_id: number;
  owner_user_id: number | null;
  owner_username?: string;
  status: string;
}

/* -------------------------------
   MATERIAL STOCK PER LOCATOR
-------------------------------- */

export interface LocatorMaterialStock {
  erp_code: string;
  material_name: string;

  stock_assigned: number;   // baseline

  allocated: number;
  returned: number;
}


/* -------------------------------
   TEAM MATERIAL ROW
-------------------------------- */

export interface TeamMaterialAllocation {
  team_id: number;
  team_name: string;

  material_code: string;

  allocated_qty: number;

  returned_qty: number;
}

/* -------------------------------
   FULL DETAILS PAYLOAD
-------------------------------- */

export interface LocatorDetails {
  locator: AdminLocator;

  materials: LocatorMaterialStock[];

  team_allocations: TeamMaterialAllocation[];

  teams: {
    team_id: number;
    team_name: string;
  }[];
}


/* ===============================
   SERVICE
================================ */

@Injectable({ providedIn: 'root' })
export class AdminLocatorService {

  private base = `${environment.apiUrl}/admin/locators`;

  constructor(private http: HttpClient) {}

  getLocators(): Observable<AdminLocator[]> {
    return this.http.get<AdminLocator[]>(this.base);
  }

  getLocatorDetails(locatorId: number): Observable<LocatorDetails> {
    return this.http.get<LocatorDetails>(
      `${this.base}/${locatorId}`
    );
  }
}
