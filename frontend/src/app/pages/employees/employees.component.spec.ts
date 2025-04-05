import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeesComponent } from './employees.component';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('EmployeesComponent', () => {
  let component: EmployeesComponent;
  let fixture: ComponentFixture<EmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, EmployeesComponent],
      providers: [
        { provide: Apollo, useValue: {} },
        { provide: Router, useValue: { navigate: () => {} } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a fetchEmployees method', () => {
    expect(typeof component.fetchEmployees).toBe('function');
  });
});