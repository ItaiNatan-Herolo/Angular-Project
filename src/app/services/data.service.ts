import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpClient) { }

  getData(page: number): Observable<any> {

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'app-id': '5fc0cb62a319a2dda1fedc79'
      })
    };

    return this.http.get(`https://dummyapi.io/data/api/user?limit=20&page=${page}`, options);
  }
}
