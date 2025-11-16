import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  URL_BACKEND = environment.apiUrl;
  timeOutmessage = 3000;
  constructor(public http: HttpClient) {}

  getReportUser(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<any>(
      this.URL_BACKEND + '/api/report/new-users-stats',
      {
        headers: headers,
      }
    );
  }

  getReportReserve(filter: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<any>(
      this.URL_BACKEND + '/api/report/reserves-report?filter=' + filter,
      {
        headers: headers,
      }
    );
  }
}
