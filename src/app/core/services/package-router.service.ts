import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '@coreui/angular';
import { PaginationParams } from '../../data/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root',
})
export class RouterTrackingRouterService {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(
    public http: HttpClient,
    private toastr: ToasterService,
    private router: Router
  ) {}

  getRouter(id: string | null, body: PaginationParams): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<any>(
      this.URL_BACKEND + '/api/admins/router-tracking' + `/${id}`,
      {
        headers: headers,
        params: {
          page: body.page?.toString() || '1',
          state: body.state?.toString() || '1',
        },
      }
    );
  }

  createRouterTracking(body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.post<any>(
      this.URL_BACKEND + '/api/admins/router-tracking',
      body,
      {
        headers: headers,
      }
    );
  }

  updateRouterTracking(id: number, body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/router-tracking/' + id,
      body,
      {
        headers: headers,
      }
    );
  }

  blockRouterTracking(user: any, state: boolean): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/router-tracking-inactive/' + user.id,
      { state: state },
      { headers: headers }
    );
  }
}
