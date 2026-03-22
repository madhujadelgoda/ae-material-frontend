import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminAuditService } from '../../../../core/services/admin-audit.service';

@Component({
  standalone: true,
  selector: 'app-operations-audit',
  imports: [CommonModule],
  templateUrl: './operations-audit.component.html'
})
export class OperationsAuditComponent implements OnInit {
  audits: any[] = [];
  limit = 25;
  offset = 0;

  constructor(private auditService: AdminAuditService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.auditService
      .getOperationsAudit(this.limit, this.offset)
      .subscribe(data => (this.audits = data));
  }

  nextPage() {
    this.offset += this.limit;
    this.load();
  }

  prevPage() {
    this.offset = Math.max(0, this.offset - this.limit);
    this.load();
  }
}
