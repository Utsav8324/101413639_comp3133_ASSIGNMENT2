import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  error: string = '';
  searchDepartment: string = '';
  searchPosition: string = '';

  constructor(private apollo: Apollo, public router: Router) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query {
            employees {
              id
              name
              email
              phone
              department
              position
            }
          }
        `
      })
      .valueChanges.subscribe(
        ({ data }) => {
          this.employees = data.employees;
          this.filteredEmployees = data.employees;
        },
        error => {
          console.error('Error fetching employees:', error);
          this.error = 'Failed to load employees';
        }
      );
  }

  deleteEmployee(id: string): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation($id: ID!) {
            deleteEmployee(id: $id)
          }
        `,
        variables: {
          id
        }
      })
      .subscribe(
        () => {
          this.employees = this.employees.filter(emp => emp.id !== id);
          this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== id);
        },
        error => {
          console.error('Delete error:', error);
        }
      );
  }

  filterEmployees(): void {
    this.filteredEmployees = this.employees.filter(emp => {
      return (
        emp.department.toLowerCase().includes(this.searchDepartment.toLowerCase()) &&
        emp.position.toLowerCase().includes(this.searchPosition.toLowerCase())
      );
    });
  }
}