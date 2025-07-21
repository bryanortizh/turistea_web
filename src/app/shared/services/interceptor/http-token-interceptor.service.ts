import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from '../keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(private keycloakService: KeycloakService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.keycloakService.keycloak.token;

    let authReq = request;
    if (token) {
      authReq = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('🚨 Interceptor caught an error:', error);

        // Handle Unauthorized (401) errors (e.g., token expired)
        if (error.status === 401) {
          console.warn('⚠️ Unauthorized! Token might be expired.');
          // Optionally, you can force logout or refresh token here.
        }

        // Ensure the error propagates back to `subscribe()`
        return throwError(() => new Error(error.message));
      })
    );
  }
}
