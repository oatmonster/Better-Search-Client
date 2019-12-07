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
    let params: IQuery;
    if ( query.query.trim() === '' ) {
      this.router.navigateByUrl( '' );
    } else {
      if ( query.hasOwnProperty( 'page' ) && query.page !== currentState.page ) {
        params = currentState;
        params.page = query.page;
      } else {
        params = currentState;
        Object.keys( query ).forEach( key => {
          params[ key ] = query[ key ];
        } );
      }
      // Clean url
      if ( query.query !== currentState.query ) {
        delete params.page;
        console.log( params );
      }
      params.query = params.query.trim();
      if ( params.hasOwnProperty( 'page' ) && params.page === 1 ) delete params.page;
      if ( params.hasOwnProperty( 'sortBy' ) && params.sortBy === '0' ) delete params.sortBy;
      if ( params.hasOwnProperty( 'listType' ) && params.listType === '0' ) delete params.listType;
      if ( params.hasOwnProperty( 'condition' ) && params.condition !== currentState.condition ) {
        params.category = currentState.category;
      }
      if ( params.hasOwnProperty( 'category' ) && params.category === '0' ) delete params.category;
      if ( params.hasOwnProperty( 'category' ) && params.category !== currentState.category ) {
        params.condition = '0';
      }
      if ( params.hasOwnProperty( 'condition' ) && params.condition === '0' ) delete params.condition;
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
          categories.set( category.categoryId, category.categoryName );
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
              conditions.set( condition.conditionId, condition.conditionName );
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

  validateQuery( dirty: IQuery ): Observable<IQuery> {

    let clean: IQuery = { query: dirty.query.trim() };

    if ( dirty.hasOwnProperty( 'page' ) && dirty.page <= 100 && dirty.page >= 1 ) {
      clean.page = dirty.page;
    }

    if ( dirty.hasOwnProperty( 'sortBy' ) && this.sortings.has( dirty.sortBy ) ) {
      clean.sortBy = dirty.sortBy;
    }



    // if ( params.has( 'sortBy' ) && this.sortings.has( params.get( 'sortBy' ) ) ) {
    //   query.sortBy = params.get( 'sortBy' );
    // }

    // if ( params.has( 'listType' ) && this.types.has( params.get( 'listType' ) ) ) {
    //   query.listType = params.get( 'listType' );
    // }

    // Asynchronous validations
    // let observables: any = {};

    // if ( params.has( 'category' ) && params.get( 'category' ) !== '0' ) {
    //   observables.category = this.apiService.isValidCategory( params.get( 'category' ) );
    // }

    // if ( params.has( 'condition' ) && params.get( 'condition' ) !== '0' ) {
    //   observables.condition = this.apiService.isValidCondition( params.get( 'category' ) || '0', params.get( 'condition' ) )
    // }

    // forkJoin( observables ).pipe<any>( defaultIfEmpty( {} ) ).subscribe( resDict => {
    //   if ( resDict.category ) query.category = params.get( 'category' );
    //   if ( resDict.condition ) query.condition = params.get( 'condition' );
    // })
    // }

    return;
  }
}

// export interface ISearchState {
//   sortings: Map<string, string>;
//   types: Map<string, string>;
//   conditions: Map<string, string>;
//   categories: Map<string, string>;

//   currentState: IQuery;

// }

// export class SearchState implements ISearchState {

//   conditions = new Map( [
//     [ 'New', 'New' ],
//     [ 'Used', 'Used' ],
//     [ 'Unspecified', 'Unspecified' ]
//   ] );
//   categories: Map<string, string>;

//   currentState: IQuery;

// }