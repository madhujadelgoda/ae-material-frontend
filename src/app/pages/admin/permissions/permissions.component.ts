import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminPermissionService } from '../../../core/services/admin-permission.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './permissions.component.html'
})
export class PermissionsComponent implements OnInit {

  permissions: any[] = [];

  constructor(private permService: AdminPermissionService) {}

  ngOnInit() {
    this.permService.getPermissions()
      .subscribe(data => this.permissions = data);
  }
}
