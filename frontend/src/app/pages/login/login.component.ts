import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private apollo: Apollo, private router: Router) {}

  loginUser() {
    this.apollo
      .query({
        query: gql`
          query Login($email: String!, $password: String!) {
            login(email: $email, password: $password)
          }
        `,
        variables: {
          email: this.email,
          password: this.password
        },
        fetchPolicy: 'no-cache' // to prevent using cached response
      })
      .subscribe({
        next: (result: any) => {
          const token = result.data.login;
          localStorage.setItem('token', token);
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.error = 'Login failed: ' + error.message;
        }
      });
  }
}