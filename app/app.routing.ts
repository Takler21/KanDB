import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './components/user.component';
import { DepartmentComponent } from './components/department.component';

const appRoutes: Routes = [
    { path: '', component: UserComponent },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);