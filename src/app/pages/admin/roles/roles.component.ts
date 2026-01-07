import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoleService } from '../../../core/services/admin-role.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  name = '';
  desc = '';

  constructor(private roleService: AdminRoleService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.roleService.getRoles().subscribe(r => this.roles = r);
  }

  create() {
    this.roleService.createRole(this.name, this.desc).subscribe(() => {
      this.name = '';
      this.desc = '';
      this.load();
    });
  }
}
