import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  getData(page: number, header: String = '', query: String = ''): Observable<any> {
    let route = `https://5fc38d6be5c28f0016f54b3a.mockapi.io/users?p=${page}&l=20`;

    if (header && query) {
      route = `${route}&${header}=${query}`
    }
    return this.http.get(route);
  }
}
