import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
  constructor( private httpClient: HttpClient ) { };

  searchItems( queryForm: any ): any {
    const options = { 'params': new HttpParams().set( 'query', queryForm.query ) };
    options.params = options.params.set( 'page', queryForm.page );

    return this.httpClient.get( environment.baseUrl + 'search', options ).pipe( tap( res => console.log( res ) ) );
  }

  getItem( id: string ): any {
    return this.httpClient.get( environment.baseUrl + 'item/' + id );
  }
}