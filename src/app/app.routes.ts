import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';
import { Login } from './login/login';
import { EmployeeList } from './employee-list/employee-list';
import { EmployeeForm } from './employee-form/employee-form';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [LoginGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeeList, canActivate: [AuthGuard] },
  { path: 'employee/add', component: EmployeeForm, canActivate: [AuthGuard] },
  { path: 'employee/edit/:id', component: EmployeeForm, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  { path: '**', redirectTo: '/employees' }
];
