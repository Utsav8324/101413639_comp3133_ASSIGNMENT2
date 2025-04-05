import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import gql from 'graphql-tag';

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent implements OnInit {
  employee: any = {
    name: '',
    email: '',
    phone: '',
    department: '',
    position: ''
  };
  id: string = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.fetchEmployee();
  }

  fetchEmployee() {
    this.apollo
      .watchQuery<any>({
        query: gql`
          query GetEmployee($id: ID!) {
            employee(id: $id) {
              id
              name
              email
              phone
              department
              position
            }
          }
        `,
        variables: { id: this.id }
      })
      .valueChanges.subscribe(({ data }) => {
        this.employee = data.employee;
      });
  }

  updateEmployee() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation UpdateEmployee(
            $id: ID!
            $name: String
            $email: String
            $phone: String
            $department: String
            $position: String
          ) {
            updateEmployee(
              id: $id
              name: $name
              email: $email
              phone: $phone
              department: $department
              position: $position
            ) {
              id
              name
            }
          }
        `,
        variables: {
          id: this.id,
          name: this.employee.name,
          email: this.employee.email,
          phone: this.employee.phone,
          department: this.employee.department,
          position: this.employee.position
        }
      })
      .subscribe(() => {
        this.router.navigate(['/employees']);
      });
  }
}