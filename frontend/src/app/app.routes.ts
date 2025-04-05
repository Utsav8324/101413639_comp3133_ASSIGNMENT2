import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewEmployeeComponent } from './pages/view-employee/view-employee.component';
import { UpdateEmployeeComponent } from './pages/update-employee/update-employee.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'add', component: AddEmployeeComponent },
  { path: 'view/:id', component: ViewEmployeeComponent },
  { path: 'edit/:id', component: UpdateEmployeeComponent } // ✅ New route
];