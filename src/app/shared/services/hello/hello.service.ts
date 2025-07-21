import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelloService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/todos/1'; // Sample API

  private apiUrl1 = 'http://localhost:8222/hello';

  constructor(private http: HttpClient) {}

  checkInterceptor(): Observable<any> {
    console.log('Making test API request...');
    return this.http.get(this.apiUrl);
  }

  checkHello(): Observable<any> {
    console.log('Making hello API request...');
    return this.http.get('/hello');
  }
 
}
