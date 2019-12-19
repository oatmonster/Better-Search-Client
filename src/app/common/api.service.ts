import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { tap, map, catchError, retry, retryWhen, mergeMap } from 'rxjs/operators';
import { Observable, throwError, timer, observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
  constructor( private httpClient: HttpClient ) { };

  getTime(): Observable<any> {
    return this.httpClient.get( environment.baseUrl + 'v2/time' ).pipe(
      retryWhen( this.retryStrategy( {
        maxRetryAttempts: 5,
        name: 'getTime'
      } ) ),
    );
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
      environment.baseUrl + 'v2/search', { observe: 'response', params: params } ).pipe(
        retryWhen( this.retryStrategy( {
          name: 'search',
        } ) ),
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
    return this.httpClient.get<IItem>( url, { observe: 'response' } ).pipe(
      retryWhen( this.retryStrategy( {
        name: 'getItem',
      } ) ),
      map( res => {
        // console.log( 'Get Item Response Body:', res.body );
        return res.body;
      } ),
    );
  }

  getItemDescription( id: string ): Observable<string> {
    let url = environment.baseUrl + 'v2/items/' + id + '/description';
    return this.httpClient.get<string>( url, { observe: 'response' } ).pipe(
      retryWhen( this.retryStrategy( {
        name: 'getItemDescription',
      } ) ),
      map( res => {
        //console.log('Get Item Description Response Body:', res.body);
        return res.body;
      } ),
    );
  }

  getItemPictures( id: string ): Observable<string[]> {
    let url = environment.baseUrl + 'v2/items/' + id + '/pictures';
    return this.httpClient.get<string[]>( url, { observe: 'response' } ).pipe(
      retryWhen( this.retryStrategy( {
        name: 'getItemPictures',
      } ) ),
      map( res => {
        return res.body;
      } ),
    );
  }

  getCategoryParents( id: string ): Observable<ICategory[]> {
    let url = environment.baseUrl + 'v2/categories/' + id + '/parents';
    return this.httpClient.get<ICategory[]>( url, { observe: 'response' } ).pipe(
      retryWhen( this.retryStrategy( {
        name: 'getCategoryParents',
      } ) ),
      map( res => {
        return res.body;
      } ),
    );
  }

  getBaseCategories(): Observable<ICategory[]> {
    let url = environment.baseUrl + 'v2/categories/0/children';
    return this.httpClient.get<ICategory[]>( url, { observe: 'response' } ).pipe(
      retryWhen( this.retryStrategy( {
        name: 'getBaseCategories',
      } ) ),
      map( res => {
        // console.log( 'Categories Response:', res );
        return res.body;
      } ),
    );
  }

  getCategoryConditions( categoryId: string ): Observable<ICondition[]> {
    let url = environment.baseUrl + 'v2/categories/' + categoryId + '/conditions';
    return this.httpClient.get<ICondition[]>( url, { observe: 'response' } ).pipe(
      retryWhen( this.retryStrategy( {
        name: 'getCategoryConditions',
      } ) ),
      map( res => {
        // console.log( 'Category Condition response body:', res.body );
        return res.body;
      } ),
    );
  }

  private retryStrategy = ( {
    maxRetryAttempts = 3,
    excludedStatusCodes = [ 400, 401, 403, 404 ],
    name
  }: {
      maxRetryAttempts?: number,
      excludedStatusCodes?: number[],
      name?: string,
    } = {}
  ) => ( attempts: Observable<any> ) => {
    return attempts.pipe(
      mergeMap( ( err, i ) => {
        const retryAttempt = i + 1;
        if ( retryAttempt > maxRetryAttempts || excludedStatusCodes.includes( err.status ) ) {
          return throwError( err );
        }
        if ( name ) {
          console.error( 'Retrying ' + name + ' attempt ' + retryAttempt + '...' );
        } else {
          console.error( 'Retrying attempt ' + retryAttempt + '...' );
        }
        return timer( 100 );
      } ),
    );
  }
}

export interface ICategory {
  id: string,
  name: string,
  parentId?: string,
}

export interface ICondition {
  id: string,
  name: string,
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
  condition?: ICondition,
  category?: ICategory,
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
  aspectHistogram: {
    aspect: string,
    values: {
      name: string,
      count: number,
    }[],
  }[],
  categoryHistogram?: {
    category: ICategory,
    count: number,
    childCategoryHistogram: {
      category: ICategory,
      count: number,
    }[],
  }[],
}