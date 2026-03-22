import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

interface TeamRow {
  team_id: number;
  team_name: string;

  material_code: string;
  material_name: string;

  allocated_quantity: number;
  used_quantity: number;
  damaged_quantity: number;
  returned_quantity: number;

  remaining_with_team: number;
}

@Component({
  standalone: true,
  selector: 'app-team-allocations',
  imports: [CommonModule],
  templateUrl: './team-allocations.html'
})
export class TeamAllocationsComponent implements OnInit {

  rows: TeamRow[] = [];
  filteredRows: TeamRow[] = [];

  teams: { team_id: number; team_name: string }[] = [];

  selectedTeamId: number | null = null;

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
      .get<TeamRow[]>(`${environment.apiUrl}/materials/team-allocations`)
      .subscribe({
        next: data => {
          this.rows = data;

          // Extract unique teams
          const map = new Map<number, string>();

          data.forEach(r => {
            map.set(r.team_id, r.team_name);
          });

          this.teams = Array.from(map.entries()).map(
            ([team_id, team_name]) => ({
              team_id,
              team_name
            })
          );

          this.filteredRows = [...this.rows];

          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'Failed to load team allocations';
          this.loading = false;
        }
      });
  }

  // ==============================
  // FILTER BY TEAM
  // ==============================

  selectTeam(teamId: number | null) {

    this.selectedTeamId = teamId;

    if (!teamId) {
      this.filteredRows = [...this.rows];
      return;
    }

    this.filteredRows = this.rows.filter(
      r => r.team_id === teamId
    );
  }

}
