import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-locator',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './locator.html'
})
export class LocatorComponent implements OnInit {

  locator: any = null;
  materials: any[] = [];

  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLocator();
    this.loadMaterials();
  }

  // ============================
  // LOAD LOCATOR INFO
  // ============================

  loadLocator(): void {
    this.http
      .get(`${environment.apiUrl}/erp/locator`)
      .subscribe({
        next: data => {
          this.locator = data;
        },
        error: () => {
          this.error = 'Failed to load locator';
        }
      });
  }

  // ============================
  // LOAD INVENTORY SUMMARY
  // ============================

  loadMaterials(): void {

    this.loading = true;
    this.error = null;

    this.http
      .get<any[]>(`${environment.apiUrl}/materials/locator-inventory`)
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
