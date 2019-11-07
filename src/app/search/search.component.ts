import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ApiService, IQuery } from '../common/api.service';
import { staggerList } from '../common/animations';

@Component( {
  selector: 'search',
  templateUrl: 'search.component.html',
  styleUrls: [ 'search.component.css' ],
  animations: [ staggerList ]
} )
export class SearchComponent implements OnInit {

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
    [ 'New', [ 'New', '0' ] ],
    [ 'Used', [ 'Used', '1' ] ],
    [ 'Unspecified', [ 'Unspecified', '2' ] ]
  ] );
  categories: Map<string, string[]>;

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
  ) {
  };

  search( {
    newSort = this.searchForm.value.sortBy,
    newListType = this.searchForm.value.listType,
    newPage = this.searchForm.value.page,
    newCategory = this.searchForm.value.category,
    newCondition = this.searchForm.value.condition
  } = {} ) {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( +newSort > 0 ) params.sortBy = newSort;
    if ( +newListType > 0 ) params.listType = newListType;
    if ( newPage > 1 ) params.page = newPage;
    if ( newCondition != this.currentState.condition ) newCategory = this.currentState.category;
    if ( +newCategory > 0 ) params.category = newCategory;
    if ( newCategory != this.currentState.category ) newCondition = '0';
    if ( +newCondition != 0 ) params.condition = newCondition;

    this.router.navigate( [ 'search', params ] );
  }


  setPages( currentPage: number, totalPages: number, toDisplay: number ) {
    var minPage = currentPage - Math.floor( toDisplay / 2 );
    var maxPage = currentPage + Math.floor( toDisplay / 2 );
    var extraLeft = Math.max( minPage * -1 + 1, 0 );
    var extraRight = Math.max( maxPage - totalPages, 0 );

    maxPage = Math.min( maxPage + extraLeft, totalPages );
    minPage = Math.max( 1, minPage - extraRight );

    this.pages = [];
    for ( var i = minPage; i <= maxPage; i++ ) {
      this.pages.push( i );
    }
  }

  updateConditions() {
    var conditions = new Map();
    conditions.set( '0', [ 'Any Condition', '0' ] );
    if ( this.searchForm.value.category == '0' ) {
      conditions.set( 'New', [ 'New', '1' ] );
      conditions.set( 'Used', [ 'Used', '2' ] );
      conditions.set( 'Unspecified', [ 'Unspecified', '3' ] );
      this.conditions = conditions;
    } else {
      this.apiService.getCategoryConditions( this.searchForm.value.category ).subscribe( res => {
        if ( res.Category != undefined ) {
          res.Category[ 0 ].ConditionValues[ 0 ].Condition.forEach( ( element, index ) => {
            conditions.set( element.ID[ 0 ], [ element.DisplayName[ 0 ], index ] );
          } );
          conditions.set( 'Unspecified', [ 'Unspecified', res.Category[ 0 ].ConditionValues[ 0 ].Condition.length + 1 ] );
        } else {
          conditions.set( 'Used', [ 'Used', '1' ] );
          conditions.set( 'Unspecified', [ 'Unspecified', '2' ] );
        }
        this.conditions = conditions;
      } );
    }
  }

  updateCategories() {
    this.apiService.getBaseCategories().subscribe( res => {
      if ( res.Ack[ 0 ] === 'Success' ) {
        this.categories = new Map(
          res.CategoryArray[ 0 ].Category.map( ( obj, i ) => {
            return [ obj.CategoryID[ 0 ], [ obj.CategoryName[ 0 ], i ] ];
          } )
        );
        this.categories.set( '0', [ 'All Categories', '-1' ] );
      }
    } );
  }

  sortMapInOrder( a, b ) {
    return +a.value[ 1 ] > +b.value[ 1 ] ? 1 : ( +b.value[ 1 ] > +a.value[ 1 ] ? -1 : 0 );
  }

  ngOnInit() {

    this.updateCategories();

    this.activatedRoute.paramMap.subscribe( params => {
      if ( !params.has( 'query' ) || params.get( 'query' ) == '' ) {
        this.router.navigateByUrl( '' );
      }

      var query: IQuery = { query: params.get( 'query' ) || '' }

      if ( params.has( 'page' ) && +params.get( 'page' ) <= 100 && +params.get( 'page' ) >= 1 ) {
        query.page = +params.get( 'page' );
      }

      if ( params.has( 'sortBy' ) && this.sortings.has( params.get( 'sortBy' ) ) ) {
        query.sortBy = params.get( 'sortBy' );
      }

      if ( params.has( 'listType' ) && this.types.has( params.get( 'listType' ) ) ) {
        query.listType = params.get( 'listType' );
      }

      if ( params.has( 'category' ) ) {
        query.category = params.get( 'category' );
      }

      if ( params.has( 'condition' ) ) {
        query.condition = params.get( 'condition' );
      }

      console.log( query );

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
          this.setPages( +this.pagination.pageNumber[ 0 ], Math.min( 100, +this.pagination.totalPages[ 0 ] ), 8 );

        } else {
          console.log( 'Invalid Search' );
        }

        this.searchForm.patchValue( this.currentState );
        this.updateConditions();
        window.scroll( 0, 0 );

      } );
    } );
  }
}