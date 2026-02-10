import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { LayoutComponent } from './layout/layout';

import { DashboardComponent } from './pages/dashboard/dashboard';

import { LocatorOverviewComponent } from './pages/admin/locator-overview/locator-overview.component';


import { LocatorComponent } from './pages/locator/locator';
import { AssignMaterialComponent } from './pages/assign-material/assign-material';
import { ReturnMaterialComponent } from './pages/return-material/return-material';
import { BulkAllocateComponent } from './pages/bulk-allocate/bulk-allocate';

import { UsersComponent } from './pages/admin/users/users.component';
import { RolesComponent } from './pages/admin/roles/roles.component';
import { PermissionsComponent } from './pages/admin/permissions/permissions.component';
import { RolePermissionsComponent } from './pages/admin/role-permissions/role-permissions.component';

import { AuditComponent } from './pages/admin/audit/audit.component';
import { OperationsAuditComponent } from './pages/admin/audit/operations-audit/operations-audit.component';
import { SecurityAuditComponent } from './pages/admin/audit/security-audit/security-audit.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { permissionGuard } from './core/guards/permission.guard';

import { TeamAllocationsComponent } from './pages/locator/team-allocations/team-allocations';
import { LocatorInventoryComponent } from './pages/locator/inventory';


export const routes: Routes = [

  // ======================
  // AUTH
  // ======================
  {
    path: 'login',
    component: LoginComponent
  },

  // ======================
  // PROTECTED APP
  // ======================
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      // ======================
      // MAIN
      // ======================
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
      },

      {
  path: 'admin/locators',
  component: LocatorOverviewComponent,
  canActivate: [
    roleGuard('ADMIN'),
    permissionGuard('admin.locator.view')
  ],
  data: { title: 'Locator Overview' }
},
{
  path: 'locator',
  component: LocatorComponent,
  canActivate: [permissionGuard('erp.locator.view')],
  data: {
    title: 'My Locator',
    breadcrumb: 'My Locator'
  },

  children: [

    // ============================
    // DEFAULT TAB → INVENTORY
    // ============================
    {
      path: '',
      component: LocatorInventoryComponent,
      pathMatch: 'full'
    },

    // ============================
    // TEAM ALLOCATIONS TAB
    // ============================
    {
      path: 'team-allocations',
      component: TeamAllocationsComponent,
      canActivate: [
        permissionGuard('material.view_team_allocations')
      ],
      data: {
        title: 'Team Allocations',
        breadcrumb: 'Team Allocations'
      }
    }

  ]
},

      // ======================
      // MATERIAL OPERATIONS
      // ======================
      {
        path: 'assign',
        component: AssignMaterialComponent,
        canActivate: [permissionGuard('material.allocate')],
        data: { title: 'Assign Materials', breadcrumb: 'Assign' }
      },

      {
        path: 'return',
        component: ReturnMaterialComponent,
        canActivate: [permissionGuard('material.return')],
        data: { title: 'Return Materials', breadcrumb: 'Return' }
      },

      {
        path: 'bulk-allocate',
        component: BulkAllocateComponent,
        canActivate: [permissionGuard('material.allocate.bulk')],
        data: { title: 'Bulk Allocation', breadcrumb: 'Bulk Allocate' }
      },

      // ======================
      // ADMIN
      // ======================
      {
        path: 'admin/users',
        component: UsersComponent,
        canActivate: [
          roleGuard('ADMIN'),
          permissionGuard('user.view')
        ],
        data: { title: 'Users', breadcrumb: 'Users' }
      },

      {
        path: 'admin/roles',
        component: RolesComponent,
        canActivate: [
          roleGuard('ADMIN'),
          permissionGuard('role.view')
        ],
        data: { title: 'Roles', breadcrumb: 'Roles' }
      },

      {
        path: 'admin/permissions',
        component: PermissionsComponent,
        canActivate: [
          roleGuard('ADMIN'),
          permissionGuard('permission.view')
        ],
        data: { title: 'Permissions', breadcrumb: 'Permissions' }
      },

      {
        path: 'admin/role-permissions',
        component: RolePermissionsComponent,
        canActivate: [
          roleGuard('ADMIN'),
          permissionGuard('role.permission.assign')
        ],
        data: { title: 'Role Permissions', breadcrumb: 'Role Permissions' }
      },

      // ======================
      // AUDIT
      // ======================
      {
        path: 'admin/audit',
        component: AuditComponent,
        canActivate: [roleGuard('ADMIN')],
        data: { title: 'Audit', breadcrumb: 'Audit' },
        children: [

          {
            path: '',
            redirectTo: 'operations',
            pathMatch: 'full'
          },

          {
            path: 'operations',
            component: OperationsAuditComponent,
            canActivate: [permissionGuard('audit.operations.view')],
            data: { title: 'Operations Audit', breadcrumb: 'Operations' }
          },

          {
            path: 'security',
            component: SecurityAuditComponent,
            canActivate: [permissionGuard('audit.security.view')],
            data: { title: 'Security Audit', breadcrumb: 'Security' }
          }
        ]
      },

      // ======================
      // DEFAULT
      // ======================
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // ======================
  // FALLBACK
  // ======================
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
