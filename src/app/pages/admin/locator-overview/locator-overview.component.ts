import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AdminLocatorService,
  AdminLocator,
  LocatorDetails,
  TeamMaterialAllocation
} from '../../../core/services/admin-locator.service';

@Component({
  standalone: true,
  selector: 'app-locator-overview',
  imports: [CommonModule],
  templateUrl: './locator-overview.component.html'
})
export class LocatorOverviewComponent implements OnInit {

  locators: AdminLocator[] = [];
  selectedLocatorId: number | null = null;

  details: LocatorDetails | null = null;

  selectedTeamId: number | null = null;
  filteredTeamRows: TeamMaterialAllocation[] = [];

  loadingLocators = false;
  loadingDetails = false;

  error = '';

  constructor(
    private locatorService: AdminLocatorService
  ) {}

  ngOnInit(): void {
    this.loadLocators();
  }

  /* ===============================
     LOAD LOCATORS
  ================================ */

  loadLocators() {
    this.loadingLocators = true;

    this.locatorService.getLocators().subscribe({
      next: data => {
        this.locators = data;
        this.loadingLocators = false;
      },
      error: () => {
        this.error = 'Failed to load locators';
        this.loadingLocators = false;
      }
    });
  }

  /* ===============================
     SELECT LOCATOR
  ================================ */

  selectLocator(locatorId: number) {
    this.selectedLocatorId = locatorId;
    this.details = null;
    this.selectedTeamId = null;
    this.filteredTeamRows = [];

    this.loadDetails();
  }

  /* ===============================
     LOAD DETAILS
  ================================ */

  loadDetails() {
    if (!this.selectedLocatorId) return;

    this.loadingDetails = true;

    this.locatorService
      .getLocatorDetails(this.selectedLocatorId)
      .subscribe({
        next: data => {
          this.details = data;
          this.loadingDetails = false;
        },
        error: () => {
          this.error = 'Failed to load locator details';
          this.loadingDetails = false;
        }
      });
  }

  /* ===============================
     SELECT TEAM
  ================================ */

  selectTeam(teamId: number) {
    this.selectedTeamId = teamId;

    this.filteredTeamRows =
      this.details?.team_allocations.filter(
        r => r.team_id === teamId
      ) || [];
  }
}
