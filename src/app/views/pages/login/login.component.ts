import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, HttpClient],
})
export class LoginComponent {
  formControl: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  loginLoading = false;
  timeOutmessage = 5000;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

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
        next: (userResponse: any) => {
          this.loginLoading = false;
          this.toastr.success('Sesión iniciada con éxito', 'Realizado', {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          });
          this.formControl.reset();
          this.router.navigate(['/dashboard']);
          localStorage.setItem('token_turistea', userResponse['JWT']);
        },
        error: (error) => {
          this.loginLoading = false;
          this.toastr.error(error.error.message, 'Acceso denegado', {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          });
        },
      });
  }
}