import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToasterService } from '@coreui/angular';
import { PaginationParams } from '../../data/interfaces/pagination.interface';
import { ClientResponse } from '../../data/interfaces/client.interface';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(
    public http: HttpClient,
    private toastr: ToasterService,
    private router: Router
  ) {}

  getClient(body: PaginationParams): Observable<ClientResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<ClientResponse>(
      this.URL_BACKEND + '/api/users-intranet',
      {
        headers: headers,
        params: {
          page: body.page?.toString() || '1',
          state: body.state?.toString() || '1',
        },
      }
    );
  }

  updateAdmin(id: number): Observable<ClientResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.post<ClientResponse>(
      `${this.URL_BACKEND}/api/users-intranet/unsubscribe/clean`,
      { userId: id },
      {
        headers: headers,
      }
    );
  }
}
