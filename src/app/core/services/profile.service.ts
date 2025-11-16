import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  URL_BACKEND = environment.apiUrl;
  timeOutmessage = 3000;
  constructor(
    public http: HttpClient,
  ) {}

  setProfile(profile: Profile): void {
    localStorage.setItem('profile_turistea', JSON.stringify(profile));
  }

  getStoredProfile(): Profile | null {
    const profileData = localStorage.getItem('profile_turistea');
    return profileData ? JSON.parse(profileData) : null;
  }

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
