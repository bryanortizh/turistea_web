import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '@coreui/angular';
import { PaginationParams } from '../../data/interfaces/pagination.interface';
import { DriverResponse } from '../../data/interfaces/driver.interface';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(
    public http: HttpClient,
    private toastr: ToasterService,
    private router: Router
  ) {}

  getClient(body: PaginationParams): Observable<DriverResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<DriverResponse>(
      this.URL_BACKEND + '/api/admins/drivers',
      {
        headers: headers,
        params: {
          page: body.page?.toString() || '1',
          state: body.state?.toString() || '1',
        },
      }
    );
  }

  createDriver(body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.post<any>(this.URL_BACKEND + '/api/admins/drivers', body, {
      headers: headers,
    });
  }

  updateDriver(id: number, body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/drivers/' + id,
      body,
      {
        headers: headers,
      }
    );
  }

  blockDriver(user: DriverResponse, state: boolean): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/drivers-inactive/' + user.id,
      { state: state, email: user.email },
      { headers: headers }
    );
  }

  searchDriver(term: string): Observable<DriverResponse[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<DriverResponse[]>(
      this.URL_BACKEND + `/api/admins/driver/${term}`,
      { headers: headers }
    );
  }
}
