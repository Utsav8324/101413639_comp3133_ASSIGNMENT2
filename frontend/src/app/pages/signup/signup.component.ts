import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private apollo: Apollo, private router: Router) {}

  signupUser() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation Signup($username: String!, $email: String!, $password: String!) {
            signup(username: $username, email: $email, password: $password) {
              id
              email
            }
          }
        `,
        variables: {
          username: this.username,
          email: this.email,
          password: this.password
        }
      })
      .subscribe({
        next: () => {
          this.success = 'Signup successful! Redirecting...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (error) => {
          this.error = 'Signup failed: ' + error.message;
        }
      });
  }
}