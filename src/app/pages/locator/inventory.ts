import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-locator-inventory',
  imports: [CommonModule],
  templateUrl: './inventory.html'
})
export class LocatorInventoryComponent implements OnInit {

  materials: any[] = [];

  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

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
