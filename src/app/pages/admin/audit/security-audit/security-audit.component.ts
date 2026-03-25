import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAuditService } from '../../../../core/services/admin-audit.service';

@Component({
  standalone: true,
  selector: 'app-security-audit',
  imports: [CommonModule],
  templateUrl: './security-audit.component.html'
})
export class SecurityAuditComponent implements OnInit {
  audits: any[] = [];
  limit = 25;
  offset = 0;
  loading = false;

  constructor(private auditService: AdminAuditService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.auditService
      .getSecurityAudit(this.limit, this.offset)
      .subscribe({
        next: data => {
          this.audits = data;
          this.loading = false;
        },
        error: () => {
          this.audits = [];
          this.loading = false;
        }
      });
  }

  nextPage() {
    if (!this.hasNext || this.loading) {
      return;
    }

    this.offset += this.limit;
    this.load();
  }

  prevPage() {
    if (!this.hasPrev || this.loading) {
      return;
    }

    this.offset = Math.max(0, this.offset - this.limit);
    this.load();
  }

  get currentPage(): number {
    return Math.floor(this.offset / this.limit) + 1;
  }

  get hasPrev(): boolean {
    return this.offset > 0;
  }

  get hasNext(): boolean {
    return this.audits.length >= this.limit;
  }

  get currentRangeStart(): number {
    if (this.audits.length === 0) {
      return 0;
    }

    return this.offset + 1;
  }

  get currentRangeEnd(): number {
    return this.offset + this.audits.length;
  }
}
