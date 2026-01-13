import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

interface Employee {
  id?: string;
  name: string;
  position: string;
  department: string;
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
})
export class EmployeeForm implements OnInit {
  employeeForm: FormGroup;
  isEdit = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.employeeId;
    if (this.isEdit) {
      this.employeeService.getEmployees().subscribe((emps: any[]) => {
        const emp = emps.find(e => e.id === this.employeeId);
        if (emp) {
          this.employeeForm.patchValue(emp);
        }
      });
    }
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employee = this.employeeForm.value;
      if (this.isEdit && this.employeeId) {
        this.employeeService.updateEmployee({ ...employee, id: this.employeeId }).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      } else {
        this.employeeService.addEmployee(employee).subscribe(() => {
          this.router.navigate(['/employees']);
        });
      }
    }
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
