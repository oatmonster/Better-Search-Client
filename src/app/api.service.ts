import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
  constructor( private httpClient: HttpClient ) { };

  searchItems( keyword: string ): any {
    const options = { 'params': new HttpParams().set( 'keyword', keyword ) };

    return this.httpClient.get( environment.baseUrl + 'search', options );
  }

  getItem( id: string ): any {
    return this.httpClient.get( environment.baseUrl + 'item/' + id );
  }
}