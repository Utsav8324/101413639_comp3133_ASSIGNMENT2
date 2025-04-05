import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { RouterModule, Router } from '@angular/router';
import gql from 'graphql-tag';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  name = '';
  email = '';
  phone = '';
  department = '';
  position = '';
  error = '';

  constructor(private apollo: Apollo, public router: Router) {}

  addEmployee() {
    this.apollo.mutate({
      mutation: gql`
        mutation AddEmployee($name: String!, $email: String!, $phone: String, $department: String, $position: String) {
          addEmployee(name: $name, email: $email, phone: $phone, department: $department, position: $position) {
            id
          }
        }
      `,
      variables: {
        name: this.name,
        email: this.email,
        phone: this.phone,
        department: this.department,
        position: this.position
      }
    }).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.error = 'Error: ' + err.message;
      }
    });
  }
}