import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { KeycloakService } from './keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurd implements CanActivate {

  constructor(
    private router: Router,
    private keycloakService: KeycloakService
  ) { }

  canActivate() {
    if (this.keycloakService.keycloak.isTokenExpired) {
      return true;
    } else {
      this.router.navigateByUrl('/sessions/signin');
    }
  }
}
