import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(
    public http: HttpClient,
  ) {}

  getProfile(): Observable<Profile> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<Profile>(this.URL_BACKEND + '/api/admins/profile', {
      headers: headers,
    });
  }

  closeSession(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.get(this.URL_BACKEND + '/api/signout', {
      headers: headers,
    });
  }

  updatePassword(current_password: string, new_password: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    const body = {
      current_password: current_password,
      new_password: new_password,
    };

    return this.http.put(this.URL_BACKEND + '/api/admins/password/update', body, {
      headers: headers,
    });
  }
}
