import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
  constructor( private http: HttpClient ) { };

  searchItems( keywords: string ): any {
    return this.http.get( environment.baseUrl + 'search/' + keywords );
  }

  getItem( id: string ): any {
    return this.http.get( environment.baseUrl + 'item/' + id );
  }
}