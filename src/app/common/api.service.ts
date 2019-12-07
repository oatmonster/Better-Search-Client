import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { tap, map, catchError, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  constructor( private httpClient: HttpClient ) { };

  getTime(): Observable<any> {
    return this.httpClient.get( environment.baseUrl + 'v2/time' );
  }

  searchItems( queryForm: IQuery ): Observable<ISearchResult> {
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
    ).pipe(
      map( res => {
        // TODO: Check response status code
        // console.log( 'Search Items Response Body:', res.body );
        return res.body;
      } ),
      catchError( err => {
        return throwError( err );
      } ),
    );
  }

  getItem( id: string ): Observable<IItem> {
    let url = environment.baseUrl + 'v2/items/' + id;
    return this.httpClient.get<IItem>( url, { observe: 'response' } ).pipe( map( res => {
      console.log( 'Get Item Response Body:', res.body );
      return res.body;
    } ) );
  }

  getItemDescription( id: string ): Observable<string> {
    let url = environment.baseUrl + 'v2/items/' + id + '/description';
    return this.httpClient.get<string>( url, { observe: 'response' } ).pipe( map( res => {
      //console.log('Get Item Description Response Body:', res.body);
      return res.body;
    } ) );
  }

  getItemPictures( id: string ): Observable<string[]> {
    let url = environment.baseUrl + 'v2/items/' + id + '/pictures';
    return this.httpClient.get<string[]>( url, { observe: 'response' } ).pipe( map( res => {
      return res.body;
    } ) );
  }

  getBaseCategories(): Observable<ICategory[]> {
    let url = environment.baseUrl + 'v2/categories';
    return this.httpClient.get<ICategory[]>( url, { observe: 'response' } ).pipe(
      map( res => {
        // console.log( 'Categories Response:', res );
        return res.body;
      } ),
      retry( 2 ),
    );
  }

  getCategoryConditions( categoryId: string ): Observable<ICondition[]> {
    let url = environment.baseUrl + 'v2/categories/' + categoryId + '/conditions';
    return this.httpClient.get<ICondition[]>( url, { observe: 'response' } ).pipe(
      map( res => {
        // console.log( 'Category Condition response body:', res.body );
        return res.body;
      } ),
      retry( 2 ),
    );
  }

  isValidCategory( id: string ): Observable<any> {
    if ( id === '0' ) {
      return new Observable<boolean>( observer => {
        observer.next( true );
        observer.complete();
      } );
    }
    let url = environment.baseUrl + 'v2/categories/' + id;
    return this.httpClient.get<ICategory>( url, { observe: 'response' } ).pipe(
      map( res => {
        return true;
      } ),
      catchError( err => {
        return new Observable<boolean>( observer => {
          observer.next( false );
          observer.complete();
        } );
      } ),
    );
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

    if ( conditionId === '0' || conditionId === 'Unspecified' ) return trueObs;
    else if ( categoryId === '0' ) {
      if ( conditionId === 'New' || conditionId === 'Used' ) return trueObs;
      else return falseObs;
    } else {
      let url = environment.baseUrl + 'v2/categories/' + categoryId + '/conditions'
      return this.httpClient.get<ICondition[]>( url, { observe: 'response' } ).pipe(
        map( res => {
          if ( res.body.length > 0 ) {
            let conditions = res.body.map( condition => {
              return condition.conditionId;
            } );
            return conditions.includes( conditionId );
          } else {
            return conditionId === 'Used';
          }
        } )
      );
    }
  }
}

export interface ICategory {
  categoryId: string,
  categoryName: string,
  parentId?: string,
}

export interface ICondition {
  conditionId: string,
  conditionName: string,
}

export interface IQuery {
  query: string,
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
  galleryUrls?: string[],
  country: string,
  condition?: {
    conditionId: string,
    conditionName: string,
  },
  category: {
    categoryId: string,
    categoryName: string,
  },
  listingInfo: {
    startTimeUtc: string,
    endTimeUtc: string,
    timeRemaining: string,
  },
  listingType: 'Advertisement' | 'Auction' | 'AuctionWithBIN' | 'FixedPrice' | 'OtherType',
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
  watchCount?: number,
  bidCount?: number,
  shippingInfo: {
    type: string,
    cost: number,
    currencyId: string,
  },
  description?: string,
  itemEbayUrl?: string,
}

export interface ISearchResult {
  searchResult: {
    count: number,
    items: IItem[],
  },
  pagination: {
    page: number,
    totalPages: number,
    totalEntries: number,
    entriesPerPage: number,
  },
  searchEbayUrl: string,
}