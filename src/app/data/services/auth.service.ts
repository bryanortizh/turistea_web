import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '@coreui/angular';
import { Auth } from '../interfaces/auth.interface';

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

  // Http Options
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
          /* this.toastr.info("Sesión Terminada!", "Acción Realizada", {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          }); */

          localStorage.removeItem('token_turistea');
          localStorage.clear();

          // this.router.navigateByUrl('/login');
          this.router.navigate([`/auth/login`]);
        },
        (error) => {
          /*  this.toastr.info("Sesión Terminada!", "Acción Realizada", {
            timeOut: this.timeOutmessage,
            closeButton: true,
            progressBar: true,
          });
 */
          localStorage.removeItem('token_turistea');
          localStorage.clear();

          this.router.navigate([`/auth/login`]);
        }
      );
    /* 
    this.toastr.info("Sesión Terminada!", "Acción Realizada", {
      timeOut: environment.timeOutmessage,
      closeButton: true,
      progressBar: true,
    }); */

    /*   localStorage.removeItem("token_turistea");
    localStorage.clear();
    this.router.navigate([`/auth/login`]); */
  }

  RegistrarUser(customer: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Basic ' + localStorage.getItem('token_turistea')
    );

    return this.http.post(this.URL_BACKEND + '/api/signup', customer, {
      headers: headers,
    });
  }

  login(email: string, password: string): Observable<Auth> {
    return this.http.post<Auth>(this.URL_BACKEND + '/api/admin-signin', {
      email,
      password,
    });
  }

  obtenerDatosAdmin(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<any>(this.URL_BACKEND + '/api/admins/profile', {
      headers: headers,
    });
  }
}
