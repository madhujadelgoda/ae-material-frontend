import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LocatorComponent } from './pages/locator/locator';
import { AssignMaterialComponent } from './pages/assign-material/assign-material';
import { ReturnMaterialComponent } from './pages/return-material/return-material';
import { BulkAllocateComponent } from './pages/bulk-allocate/bulk-allocate';

import { UsersComponent } from './pages/admin/users/users.component';
import { RolesComponent } from './pages/admin/roles/roles.component';
import { PermissionsComponent } from './pages/admin/permissions/permissions.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// export const routes: Routes = [
//   // Login page (no layout)
//   { path: 'login', component: LoginComponent },

//   // Protected layout
//   {
//     path: '',
//     component: LayoutComponent,
//     canActivate: [authGuard],
//     children: [

//       { path: 'dashboard', component: DashboardComponent },
//       { path: 'locator', component: LocatorComponent },
//       { path: 'assign', component: AssignMaterialComponent },
//       { path: 'return', component: ReturnMaterialComponent },
//       { path: 'bulk-allocate', component: BulkAllocateComponent },

//       // ADMIN ROUTES (inside layout)
//       {
//         path: 'admin/users',
//         component: UsersComponent,
//         canActivate: [roleGuard('ADMIN')]
//       },
//       {
//         path: 'admin/roles',
//         component: RolesComponent,
//         canActivate: [roleGuard('ADMIN')]
//       },
//       {
//         path: 'admin/permissions',
//         component: PermissionsComponent,
//         canActivate: [roleGuard('ADMIN')]
//       },

//       // default
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
//     ]
//   },

//   // fallback
//   { path: '**', redirectTo: 'dashboard' }
// ];


export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
      },

      {
        path: 'locator',
        component: LocatorComponent,
        data: { title: 'My Locator', breadcrumb: 'My Locator' }
      },

      {
        path: 'assign',
        component: AssignMaterialComponent,
        data: { title: 'Assign Materials', breadcrumb: 'Assign' }
      },

      {
        path: 'return',
        component: ReturnMaterialComponent,
        data: { title: 'Return Materials', breadcrumb: 'Return' }
      },

      {
        path: 'bulk-allocate',
        component: BulkAllocateComponent,
        data: { title: 'Bulk Allocation', breadcrumb: 'Bulk Allocate' }
      },

      // ADMIN
      {
        path: 'admin/users',
        component: UsersComponent,
        canActivate: [roleGuard('ADMIN')],
        data: { title: 'Users', breadcrumb: 'Users' }
      },
      {
        path: 'admin/roles',
        component: RolesComponent,
        canActivate: [roleGuard('ADMIN')],
        data: { title: 'Roles', breadcrumb: 'Roles' }
      },
      {
        path: 'admin/permissions',
        component: PermissionsComponent,
        canActivate: [roleGuard('ADMIN')],
        data: { title: 'Permissions', breadcrumb: 'Permissions' }
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }
];
