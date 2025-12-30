import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LocatorComponent } from './pages/locator/locator';
import { AssignMaterialComponent } from './pages/assign-material/assign-material';
import { ReturnMaterialComponent } from './pages/return-material/return-material';
import { BulkAllocateComponent } from './pages/bulk-allocate/bulk-allocate';

// // import { MaterialsComponent } from './pages/materials/materials';
// import { TeamsComponent } from './pages/teams/teams';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'locator', component: LocatorComponent },
      { path: 'assign', component: AssignMaterialComponent },
      { path: 'return', component: ReturnMaterialComponent },
      { path: 'bulk-allocate', component: BulkAllocateComponent }

    ]
  }
];
