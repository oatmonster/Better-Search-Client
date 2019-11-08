import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  constructor( private httpClient: HttpClient ) { };

  searchItems( queryForm: IQuery ): Observable<any> {
    const options = { 'params': new HttpParams().set( 'query', queryForm.query ) };

    // Set optional params
    if ( queryForm.page != null ) {
      options.params = options.params.set( 'page', '' + queryForm.page );
    }
    if ( queryForm.sortBy != null ) {
      options.params = options.params.set( 'sortBy', queryForm.sortBy );
    }
    if ( queryForm.listType != null ) {
      options.params = options.params.set( 'listType', queryForm.listType );
    }
    if ( queryForm.category != null ) {
      options.params = options.params.set( 'category', queryForm.category );
    }
    if ( queryForm.condition != null ) {
      options.params = options.params.set( 'condition', queryForm.condition );
    }

    return this.httpClient.get( environment.baseUrl + 'search', options ).pipe( tap( res => {
      // console.log( 'Search Items Response:', res );
    } ) );
  }

  getItem( id: string ): Observable<any> {
    return this.httpClient.get( environment.baseUrl + 'item/' + id ).pipe( tap( res => {
      // console.log( 'Get Item Response:', res );
    } ) );
  }

  getBaseCategories(): Observable<any> {
    return this.httpClient.get( environment.baseUrl + 'category' ).pipe( tap( res => {
      // console.log( 'Categories Response:', res );
    } ) );
  }

  getCategoryConditions( categoryID: string ): Observable<any> {
    return this.httpClient.get( environment.baseUrl + 'category/' + categoryID + '/condition' ).pipe( tap( res => {
      // console.log( 'Category Condition Response:', res );
    } ) );
  }

  isValidCategory( id: string ): Observable<boolean> {
    if ( id === '0' ) {
      return new Observable<boolean>( observer => {
        observer.next( true );
        observer.complete();
      } );
    }
    return this.httpClient.get<any>( environment.baseUrl + 'category/' + id ).pipe( tap( res => {
      console.log( 'Valid Category Response:', res );
    } ) ).pipe( map( res => {
      return res.CategoryCount[ 0 ] == 1;
    } ) );
  }

  isValidCondition( categoryID: string, conditionID: string ): Observable<boolean> {
    const trueObs = new Observable<boolean>( observer => {
      observer.next( true )
      observer.complete();
    } );

    const falseObs = new Observable<boolean>( observer => {
      observer.next( false )
      observer.complete();
    } );

    if ( conditionID == '0' || conditionID == 'Unspecified' ) return trueObs;
    else if ( categoryID === '0' ) {
      if ( conditionID == 'New' || conditionID == 'Used' ) return trueObs;
      else return falseObs;
    } else {
      return this.httpClient.get<any>( environment.baseUrl + 'category/' + categoryID + '/condition' ).pipe( map( res => {
        if ( res.Category != undefined ) {
          var conditions = [];
          res.Category[ 0 ].ConditionValues[ 0 ].Condition.forEach( ( element, index ) => {
            conditions.push( element.ID[ 0 ] );
          } );
          return conditions.includes( conditionID );
        } else {
          return conditionID == 'Used';
        }
      } ) );
    }
    // return this.httpClient.get( environment.baseUrl + 'category/' + categoryID + '/condition' ).pipe( tap( res => {
    //   console.log( 'Valid Condition Response:', res );
    // } ) );
  }
}

export interface IQuery {
  query?: string,
  page?: number,
  sortBy?: string,
  listType?: string,
  category?: string,
  condition?: string
}