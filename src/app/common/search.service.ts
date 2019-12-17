import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { ApiService, IQuery, ISearchResult } from './api.service';

@Injectable()
export class SearchService {

  constructor( private apiService: ApiService, private router: Router ) { }

  private sortings = new Map( [
    [ '0', 'Best Match' ],
    [ '1', 'Time: Ending Soonest' ],
    [ '2', 'Time: Newly Listed' ],
    [ '3', 'Price+Shipping: Lowest First' ],
    [ '4', 'Price+Shipping: Highest First' ]
  ] );
  private types = new Map( [
    [ '0', 'All Listings' ],
    [ '1', 'Buy it Now' ],
    [ '2', 'Accepts Offers' ],
    [ '3', 'Auctions' ]
  ] );

  navigate( query: IQuery, currentState: IQuery ): void {
    if ( query.query.trim() === '' ) {
      this.router.navigateByUrl( '' );
    } else {
      let params: IQuery;
      if ( query.page !== undefined && query.page !== currentState.page ) {
        params = Object.assign( {}, currentState );
        params.page = query.page;
      } else {
        params = Object.assign( {}, currentState )
        Object.keys( query ).forEach( key => {
          params[ key ] = query[ key ];
        } );
      }
      // Clean url
      if ( query.query !== currentState.query ) {
        delete params.page;
      }
      params.query = params.query.trim();
      if ( params.page !== undefined && params.page === 1 ) delete params.page;
      if ( params.sortBy !== undefined && params.sortBy === '0' ) delete params.sortBy;
      if ( params.listType !== undefined && params.listType === '0' ) delete params.listType;
      if ( params.condition !== undefined && params.condition !== currentState.condition ) {
        params.category = currentState.category;
      }
      if ( params.category !== undefined && params.category === '0' ) delete params.category;
      if ( params.category !== undefined && params.category !== currentState.category ) {
        delete params.condition;
      }
      if ( params.condition !== undefined && params.condition === '0' ) delete params.condition;

      Object.keys( params ).forEach( key => {
        if ( params[ key ] === undefined || params[ key ] === null || params[ key ] === '' ) {
          delete params[ key ];
        }
      } );

      // console.log( params )
      this.router.navigate( [ 'search', params ] );
    }
  }

  getTypes(): Map<string, string> {
    return this.types;
  }

  getSortings(): Map<string, string> {
    return this.sortings;
  }

  getCategories(): Observable<Map<string, string>> {
    return this.apiService.getBaseCategories().pipe(
      map( res => {
        let categories = new Map<string, string>();
        categories.set( '0', 'All Categories' );
        res.forEach( category => {
          categories.set( category.id, category.name );
        } );
        return categories;
      } ),
      catchError( err => {
        return throwError( 'Failed to get base categories' );
      } ),
    );
  }

  getConditions( categoryId: string ): Observable<Map<string, string>> {

    if ( categoryId == '0' ) {
      let conditions = new Map();
      conditions.set( '0', 'Any Condition' );
      conditions.set( 'New', 'New' );
      conditions.set( 'Used', 'Used' );
      conditions.set( 'Unspecified', 'Unspecified' );
      return new Observable<Map<string, string>>( subscriber => {
        subscriber.next( conditions )
        subscriber.complete();
      } );
    } else {
      return this.apiService.getCategoryConditions( categoryId ).pipe(
        map( res => {
          let conditions = new Map()
          if ( res.length > 0 ) {
            res.forEach( ( condition ) => {
              conditions.set( condition.id, condition.name );
            } );
            conditions.set( 'Unspecified', 'Unspecified' );
          } else {
            conditions.set( 'Used', 'Used' );
            conditions.set( 'Unspecified', 'Unspecified' );
          }
          return conditions;
        } ),
        catchError( err => {
          return throwError( 'Failed to get conditions for category ' + categoryId );
        } ),
      );
    }
  }

  // Wrapper for api service searchItems 
  search( query: IQuery ): Observable<ISearchResult> {
    return this.apiService.searchItems( query );
  }

}