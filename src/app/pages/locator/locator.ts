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

  locator: any;
  materials: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadLocator();
    this.loadAvailableMaterials();
  }

  loadLocator() {
    this.http
      .get(`${environment.apiUrl}/erp/locator`)
      .subscribe(data => (this.locator = data));
  }

  loadAvailableMaterials() {
    this.http
      .get<any[]>(`${environment.apiUrl}/materials/available`)
      .subscribe(data => (this.materials = data));
  }
}
