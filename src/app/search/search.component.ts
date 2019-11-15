import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';

import { ApiService, IQuery } from '../common/api.service';
import { staggerList } from '../common/animations';


@Component( {
  selector: 'search',
  templateUrl: 'search.component.html',
  styleUrls: [ 'search.component.css' ],
  animations: [ staggerList ]
} )
export class SearchComponent implements OnInit {

  totalPages: number;
  items: any[];
  pagination: any = {};
  pages: number[] = [];
  sortings = new Map( [
    [ '0', 'Best Match' ],
    [ '1', 'Time: Ending Soonest' ],
    [ '2', 'Time: Newly Listed' ],
    [ '3', 'Price+Shipping: Lowest First' ],
    [ '4', 'Price+Shipping: Highest First' ]
  ] );
  types = new Map( [
    [ '0', 'All Listings' ],
    [ '1', 'Buy it Now' ],
    [ '2', 'Accepts Offers' ],
    [ '3', 'Auctions' ]
  ] );
  conditions = new Map( [
    [ 'New', 'New' ],
    [ 'Used', 'Used' ],
    [ 'Unspecified', 'Unspecified' ]
  ] );
  categories: Map<string, string>;

  searchForm = new FormGroup( {
    query: new FormControl( '' ),
    page: new FormControl( '' ),
    sortBy: new FormControl( '' ),
    listType: new FormControl( '' ),
    category: new FormControl( '' ),
    condition: new FormControl( '' )
  } );

  currentState: IQuery;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  search( {
    newSort = this.searchForm.value.sortBy,
    newListType = this.searchForm.value.listType,
    newPage = this.searchForm.value.page,
    newCategory = this.searchForm.value.category,
    newCondition = this.searchForm.value.condition
  } = {} ) {
    if ( this.searchForm.value.query.trim() == '' ) {
      this.router.navigateByUrl( '' );
    } else {
      var params: IQuery = { query: this.searchForm.value.query.trim() };
      if ( +newSort > 0 ) params.sortBy = newSort;
      if ( +newListType > 0 ) params.listType = newListType;
      if ( newPage > 1 ) params.page = newPage;
      if ( newCondition != this.currentState.condition ) newCategory = this.currentState.category;
      if ( +newCategory > 0 ) params.category = newCategory;
      if ( newCategory != this.currentState.category ) newCondition = '0';
      if ( +newCondition != 0 ) params.condition = newCondition;

      this.router.navigate( [ 'search', params ] );
    }

  }

  updateConditions() {
    var conditions = new Map();
    conditions.set( '0', 'Any Condition' );
    if ( this.searchForm.value.category == '0' ) {
      conditions.set( 'New', 'New' );
      conditions.set( 'Used', 'Used' );
      conditions.set( 'Unspecified', 'Unspecified' );
      this.conditions = conditions;
    } else {
      this.apiService.getCategoryConditions( this.searchForm.value.category ).subscribe( res => {
        if ( res.Category != undefined ) {
          res.Category[ 0 ].ConditionValues[ 0 ].Condition.forEach( ( element, index ) => {
            conditions.set( element.ID[ 0 ], element.DisplayName[ 0 ] );
          } );
          conditions.set( 'Unspecified', 'Unspecified' );
        } else {
          conditions.set( 'Used', 'Used' );
          conditions.set( 'Unspecified', 'Unspecified' );
        }
        this.conditions = conditions;
      } );
    }
  }

  submit() {
    console.log( 'Form Value on Submit:', this.searchForm.value );
    this.search();
  }

  updateCategories() {
    this.apiService.getBaseCategories().subscribe( res => {
      if ( res.Ack[ 0 ] === 'Success' ) {
        let categories = new Map();
        categories.set( '0', 'All Categories' );
        res.CategoryArray[ 0 ].Category.forEach( element => {
          categories.set( element.CategoryID[ 0 ], element.CategoryName[ 0 ] );
        } );
        this.categories = categories;
      }
    } );
  }

  ngOnInit() {

    this.updateCategories();

    this.activatedRoute.paramMap.subscribe( params => {
      if ( !params.has( 'query' ) || params.get( 'query' ).trim() == '' ) {
        this.router.navigateByUrl( '' );
      }

      var query: IQuery = { query: params.get( 'query' ) }

      if ( params.has( 'page' ) && +params.get( 'page' ) <= 100 && +params.get( 'page' ) >= 1 ) {
        query.page = +params.get( 'page' );
      }

      if ( params.has( 'sortBy' ) && this.sortings.has( params.get( 'sortBy' ) ) ) {
        query.sortBy = params.get( 'sortBy' );
      }

      if ( params.has( 'listType' ) && this.types.has( params.get( 'listType' ) ) ) {
        query.listType = params.get( 'listType' );
      }

      // Asynchronous validations
      var observables: any = {
      }

      if ( params.has( 'category' ) && params.get( 'category' ) !== '0' ) {
        observables.category = this.apiService.isValidCategory( params.get( 'category' ) );
      }

      if ( params.has( 'condition' ) && params.get( 'condition' ) !== '0' ) {
        observables.condition = this.apiService.isValidCondition( params.get( 'category' ) || '0', params.get( 'condition' ) )
      }

      forkJoin( observables ).pipe<any>( defaultIfEmpty( {} ) ).subscribe( resDict => {
        if ( resDict.category ) query.category = params.get( 'category' );
        if ( resDict.condition ) query.condition = params.get( 'condition' );

        console.log( 'Query from URL:', query );

        this.apiService.searchItems( query ).subscribe( res => {
          this.currentState = {
            query: query.query,
            page: 1,
            sortBy: query.sortBy || '0',
            listType: query.listType || '0',
            category: query.category || '0',
            condition: query.condition || '0'
          };

          if ( res.ack[ 0 ] == 'Success' ) {
            this.items = res.searchResult[ 0 ].item || [];
            this.pagination = res.paginationOutput[ 0 ];

            this.currentState.page = +this.pagination.pageNumber;
            this.totalPages = Math.min( 100, +this.pagination.totalPages[ 0 ] );

          } else {
            console.log( 'Invalid Search' );
          }

          this.searchForm.patchValue( this.currentState );
          this.updateConditions();
          window.scroll( 0, 0 );

        } );
      } );


    } );
  }
}