import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '@coreui/angular';
import { PaginationParams } from '../interfaces/pagination.interface';
import { AdminResponse } from '../interfaces/admin.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(
    public http: HttpClient,
    private toastr: ToasterService,
    private router: Router
  ) {}

  getAdmin(body: PaginationParams): Observable<AdminResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<AdminResponse>(this.URL_BACKEND + '/api/admins', {
      headers: headers,
      params: {
        page: body.page?.toString() || '1',
        state: body.state?.toString() || '1',
      },
    });
  }

  createAdmin(body: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
  }): Observable<AdminResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.post<AdminResponse>(
      this.URL_BACKEND + '/api/admins',
      body,
      {
        headers: headers,
      }
    );
  }

  updateAdmin(
    id: number,
    body: { name: string; lastname: string; email: string; role: string }
  ): Observable<AdminResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.put<AdminResponse>(
      `${this.URL_BACKEND}/api/admins/${id}`,
      body,
      {
        headers: headers,
      }
    );
  }
}
