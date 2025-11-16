import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  URL_BACKEND = environment.apiUrl;
  timeOutmessage = 3000;
  constructor(private http: HttpClient) {}

  getReserves(page: number = 1, limit: number = 10,status:string): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('status', status);
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get(`${this.URL_BACKEND}/api/admins/form_reserves`, {
      params,
      headers,
    });
  }

  approveReserve(id: number): Observable<any> {
     let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.put(
      `${this.URL_BACKEND}/api/admins/form_reserves/${id}/approve`,
      {status_form: 'reserve'},
      { headers } 
    );
  }

  rejectReserve(id: number): Observable<any> {
     let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.put(
      `${this.URL_BACKEND}/api/admins/form_reserves/${id}/reject`,
      {status_form: 'rejected'},
      { headers }
    );
  }
}
