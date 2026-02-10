import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-team-allocations',
  imports: [CommonModule],
  templateUrl: './team-allocations.html'
})
export class TeamAllocationsComponent implements OnInit {

  rows: any[] = [];

  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.load();
  }

  // ==============================
  // LOAD TEAM ALLOCATION SUMMARY
  // ==============================

  load(): void {

    this.loading = true;
    this.error = null;

    this.http
      .get<any[]>(`${environment.apiUrl}/materials/team-allocations`)
      .subscribe({
        next: data => {
          this.rows = data;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'Failed to load team allocations';
          this.loading = false;
        }
      });
  }

}
