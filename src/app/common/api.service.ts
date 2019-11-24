import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  constructor( private httpClient: HttpClient ) { };

  searchItems( queryForm: IQuery ): Observable<HttpResponse<ISearchResult>> {
    let params = new HttpParams().set( 'query', queryForm.query );

    // Set optional params
    if ( queryForm.page != null ) {
      params = params.set( 'page', '' + queryForm.page );
    }
    if ( queryForm.sortBy != null ) {
      params = params.set( 'sortBy', queryForm.sortBy );
    }
    if ( queryForm.listType != null ) {
      params = params.set( 'listType', queryForm.listType );
    }
    if ( queryForm.category != null ) {
      params = params.set( 'category', queryForm.category );
    }
    if ( queryForm.condition != null ) {
      params = params.set( 'condition', queryForm.condition );
    }

    return this.httpClient.get<ISearchResult>(
      environment.baseUrl + 'v2/search', { observe: 'response', params: params }
    ).pipe( tap( res => {
      console.log( 'Search Items Response:', res.body );
    } ) );
  }

  getItem( id: string, { description = false } = {} ): Observable<any> {
    let url = environment.baseUrl + 'v1/item/' + id;
    if ( description == true ) url += '/description';
    return this.httpClient.get( url ).pipe( tap( res => {
      console.log( 'Get Item Response:', res );
    } ) );
  }

  getItemPictures( id: string ): Observable<HttpResponse<string[]>> {
    let url = environment.baseUrl + 'v2/items/' + id + '/pictures';
    return this.httpClient.get<string[]>( url, { observe: 'response' } );
  }

  getBaseCategories(): Observable<any> {
    return this.httpClient.get( environment.baseUrl + 'v1/category' ).pipe( tap( res => {
      // console.log( 'Categories Response:', res );
    } ) );
  }

  getCategoryConditions( categoryId: string ): Observable<any> {
    return this.httpClient.get( environment.baseUrl + 'v1/category/' + categoryId + '/condition' ).pipe( tap( res => {
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
    return this.httpClient.get<any>( environment.baseUrl + 'v1/category/' + id ).pipe( tap( res => {
      // console.log( 'Valid Category Response:', res );
    } ) ).pipe( map( res => {
      return res.CategoryCount[ 0 ] == 1;
    } ) );
  }

  isValidCondition( categoryId: string, conditionId: string ): Observable<boolean> {
    const trueObs = new Observable<boolean>( observer => {
      observer.next( true )
      observer.complete();
    } );

    const falseObs = new Observable<boolean>( observer => {
      observer.next( false )
      observer.complete();
    } );

    if ( conditionId == '0' || conditionId == 'Unspecified' ) return trueObs;
    else if ( categoryId === '0' ) {
      if ( conditionId == 'New' || conditionId == 'Used' ) return trueObs;
      else return falseObs;
    } else {
      return this.httpClient.get<any>( environment.baseUrl + 'v1/category/' + categoryId + '/condition' ).pipe( map( res => {
        if ( res.Category != undefined ) {
          let conditions = [];
          res.Category[ 0 ].ConditionValues[ 0 ].Condition.forEach( ( element, index ) => {
            conditions.push( element.ID[ 0 ] );
          } );
          return conditions.includes( conditionId );
        } else {
          return conditionId == 'Used';
        }
      } ) );
    }
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

export interface IResponse<T> {
  ack: 'Success' | 'Failure',
  version: string,
  timestamp: Date,
  errorMessage?: string,
  body: T,
}

export interface IItem {
  itemId: string,
  title: string,
  thumbnailUrl: string,
  country: string,
  condition: {
    conditionId: string,
    conditionName: string,
  },
  category: {
    categoryId: string,
    categoryName: string,
  }
  startTime: string,
  endTime: string,
  listingType: string,
  bestOfferEnabled: boolean,
  buyItNowEnabled: boolean,
  currentPrice: {
    price: number,
    currencyId: string,
  },
  currentPriceConverted: {
    price: number,
    currencyId: string,
  },
  sellingState: string,
  watchCount: number,
  bidCount?: number,
  shippingInfo: {
    shippingType: string,
  },
}

export interface ISearchResult {
  searchResult: {
    count: number,
    items: IItem[],
  },
  pagination: {
    page: number,
    totalPages: number,
    entriesPerPage: number,
  },
  searchEbayUrl: string,
}