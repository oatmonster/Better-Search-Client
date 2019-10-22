import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
  constructor( private http: HttpClient ) { };

  searchItems( keywords: string ): any {
    return this.http.get( environment.baseUrl + 'search/' + keywords ).pipe( tap( res => console.log( res ) ) );
  }

  getItem( id: string ): any {
    return this.http.get( environment.baseUrl + 'item/' + id ).pipe( tap( res => console.log( res ) ) );
  }
}