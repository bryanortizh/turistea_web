import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
} from '@coreui/angular';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../data/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    ContainerComponent,
    FormsModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    HttpClientModule,
  ],
  providers: [AuthService, HttpClient],
})
export class LoginComponent {
  formControl: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  loginLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  signIn() {
    this.loginLoading = true;

    if (this.formControl.invalid) {
      this.loginLoading = false;
      this.formControl.markAllAsTouched();
      return;
    }
    this.authService
      .login(
        this.formControl.get('email')?.value || '',
        this.formControl.get('password')?.value || ''
      )
      .subscribe({
        next: async (userResponse: any) => {
          this.loginLoading = true;
          this.formControl.reset();
          this.router.navigate(['/dashboard']);
          localStorage.setItem('token_turistea', userResponse['JWT']);
        },
        error: (error) => {
          this.loginLoading = false;
          console.log(error);
          /*  this.toastr.error(error.error.message, 'Acceso denegado', {
            timeOut: environment.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }); */
        },
      });
  }
}
