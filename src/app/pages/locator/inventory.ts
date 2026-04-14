import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

interface InventoryItem {
  erp_code: string;
  material_name: string;
  material_subcategory: string;
  erp_description: string;
  erp_uom: string;
  measurement_code: string;
  stock_assigned: number;
  allocated_to_teams: number;
  used_qty: number;
  damaged_qty: number;
  returned_qty: number;
  available_now: number;
}

@Component({
  standalone: true,
  selector: 'app-locator-inventory',
  imports: [CommonModule],
  templateUrl: './inventory.html'
})
export class LocatorInventoryComponent implements OnInit {

  materials: InventoryItem[] = [];

  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  // ==============================
  // LOAD LOCATOR INVENTORY
  // ==============================

  load(): void {

    this.loading = true;
    this.error = null;

    this.http
      .get<InventoryItem[]>(`${environment.apiUrl}/materials/locator-inventory`)
      .subscribe({
        next: data => {
          this.materials = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load locator inventory';
          this.loading = false;
        }
      });
  }
}
