import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '@coreui/angular';
import { PaginationParams } from '../../data/interfaces/pagination.interface';
import { PackageResponse } from '../../data/interfaces/package.interface';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(
    public http: HttpClient,
    private toastr: ToasterService,
    private router: Router
  ) {}

  getClient(body: PaginationParams): Observable<PackageResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<PackageResponse>(
      this.URL_BACKEND + '/api/admins/packages',
      {
        headers: headers,
        params: {
          page: body.page?.toString() || '1',
          state: body.state?.toString() || '1',
        },
      }
    );
  }

  createPackage(body: any): Observable<any> {
    body.quantity_person = body.quantity_person.toString();
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.post<any>(this.URL_BACKEND + '/api/admins/packages', body, {
      headers: headers,
    });
  }

  updatePackage(id: number, body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/packages/' + id,
      body,
      {
        headers: headers,
      }
    );
  }

  blockPackage(user: PackageResponse, state: boolean): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/packages-inactive/' + user.id,
      { state: state },
      { headers: headers }
    );
  }
}
