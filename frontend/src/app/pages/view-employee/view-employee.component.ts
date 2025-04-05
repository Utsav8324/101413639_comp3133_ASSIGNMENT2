import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {
  employee: any = {};

  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    public router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.apollo
      .query({
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
        variables: { id }
      })
      .subscribe((result: any) => {
        this.employee = result.data.employee;
      });
  }
}