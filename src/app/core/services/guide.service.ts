import { Injectable } from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationParams } from '../../data/interfaces/pagination.interface';
import { DriverResponse } from '../../data/interfaces/driver.interface';
import { GuideResponse } from '../../data/interfaces/guide.interface';

@Injectable({
  providedIn: 'root',
})
export class GuideServices {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(public http: HttpClient) {}

  getGuide(body: PaginationParams): Observable<GuideResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<GuideResponse>(
      this.URL_BACKEND + '/api/admins/guides',
      {
        headers: headers,
        params: {
          page: body.page?.toString() || '1',
          state: body.state?.toString() || '1',
        },
      }
    );
  }

  createGuide(body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.post<any>(this.URL_BACKEND + '/api/admins/guides', body, {
      headers: headers,
    });
  }

  updateGuide(id: number, body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/guides/' + id,
      body,
      {
        headers: headers,
      }
    );
  }

  blockGuide(user: GuideResponse, state: boolean): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/guides-inactive/' + user.id,
      { state: state, email: user.email },
      { headers: headers }
    );
  }
}
