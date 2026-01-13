import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { AuthService } from '../auth.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ProgressSpinnerModule,
    MessageModule,
    FormsModule
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {
  employees: Employee[] = [];
  dataSource = { data: [] as Employee[] };
  displayedColumns: string[] = ['id', 'name', 'position', 'department', 'status', 'actions'];
  searchTerm = '';
  role = '';
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.role = this.authService.getRole();
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoadingSubject.next(true);
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.dataSource.data = data;
        this.isLoadingSubject.next(false);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoadingSubject.next(false);
      }
    });
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    this.dataSource.data = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearch();
  }

  refreshData() {
    this.loadEmployees();
  }

  viewEmployee(employee: Employee) {
    this.editEmployee(employee);
  }

  editEmployee(employee: Employee) {
    this.router.navigate(['/employee/edit', employee.id]);
  }

  deleteEmployee(id: string) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: () => {}
    });
  }

  addEmployee() {
    this.router.navigate(['/employee/add']);
  }
}
