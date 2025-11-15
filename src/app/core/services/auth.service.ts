import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Auth } from '../../data/interfaces/auth.interface';
import { ToasterService } from '@coreui/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(
    public http: HttpClient,
    private toastr: ToasterService,
    private router: Router
  ) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };

  signout() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    this.http
      .get(this.URL_BACKEND + '/api/signout', {
        headers: headers,
      })
      .subscribe(
        (resp) => {
          localStorage.removeItem('token_turistea');
          localStorage.clear();
          this.router.navigate([`/auth/login`]);
        },
        (error) => {
          localStorage.removeItem('token_turistea');
          localStorage.clear();
          this.router.navigate([`/auth/login`]);
        }
      );
  }
  
  login(email: string, password: string): Observable<Auth> {
    return this.http.post<Auth>(this.URL_BACKEND + '/api/admin-signin', {
      email,
      password,
    });
  }
}
