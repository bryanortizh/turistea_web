import { Injectable } from '@angular/core';
import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationParams } from '../../data/interfaces/pagination.interface';
import { TerraceResponse } from '../../data/interfaces/terrace.interface';

@Injectable({
  providedIn: 'root',
})
export class TerraceServices {
  URL_BACKEND = 'http://localhost:4001';
  timeOutmessage = 3000;
  constructor(public http: HttpClient) {}

  getTerrace(body: PaginationParams): Observable<TerraceResponse> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<TerraceResponse>(
      this.URL_BACKEND + '/api/admins/terraces',
      {
        headers: headers,
        params: {
          page: body.page?.toString() || '1',
          state: body.state?.toString() || '1',
        },
      }
    );
  }

  createTerrace(body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.post<any>(this.URL_BACKEND + '/api/admins/terraces', body, {
      headers: headers,
    });
  }

  updateTerrace(id: number, body: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );
    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/terraces/' + id,
      body,
      {
        headers: headers,
      }
    );
  }

  blockTerrace(user: TerraceResponse, state: boolean): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.put<any>(
      this.URL_BACKEND + '/api/admins/terraces-inactive/' + user.id,
      { state: state, email: user.email },
      { headers: headers }
    );
  }

  searchTerrace(term: string): Observable<TerraceResponse[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<TerraceResponse[]>(
      this.URL_BACKEND + '/api/admins/terraces-search/' + term,
      {
        headers: headers,
      }
    );
  }

  allTerraces(): Observable<TerraceResponse[]> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-type', 'application/json');
    headers = headers.set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token_turistea')
    );

    return this.http.get<TerraceResponse[]>(
      this.URL_BACKEND + '/api/admins/terraces-all',
      { headers: headers }
    );
  }
}