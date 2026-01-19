import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locator.html'
})
export class LocatorComponent implements OnInit {

  locator: any = null;
  materials: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLocator();
    this.loadMaterials();
  }

  loadLocator() {
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

  loadMaterials() {
    this.loading = true;

    this.http
      .get<any[]>(`${environment.apiUrl}/materials/available`)
      .subscribe({
        next: data => {
          this.materials = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load materials';
          this.loading = false;
        }
      });
  }
}
