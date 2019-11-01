import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ApiService } from './api.service';
import { IQuery } from './api.service';

@Component( {
  selector: 'search',
  templateUrl: 'search.component.html',
  styleUrls: [ 'search.component.css' ]
} )
export class SearchComponent implements OnInit {

  items: any[];
  pagination: any = {};
  pages: number[] = [];
  sortings = new Map( [
    [ 0, 'Best Match' ],
    [ 1, 'Time: Ending Soonest' ],
    [ 2, 'Time: Newly Listed' ],
    [ 3, 'Price+Shipping: Lowest First' ],
    [ 4, 'Price+Shipping: Highest First' ]
  ] );
  types = new Map( [
    [ 0, 'All Listings' ],
    [ 1, 'Buy it Now' ],
    [ 2, 'Accepts Offers' ],
    [ 3, 'Auctions' ]
  ] );
  categories: Map<number, string>;
  everythingElseID: number;

  searchForm = new FormGroup( {
    query: new FormControl( '' ),
    page: new FormControl( '' ),
    sortBy: new FormControl( '' ),
    listType: new FormControl( '' ),
    category: new FormControl( '' )
  } );

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
    newCategory = this.searchForm.value.category
  } = {} ) {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( newSort > 0 ) params.sortBy = newSort;
    if ( newListType > 0 ) params.listType = newListType;
    if ( newPage > 1 ) params.page = newPage;
    if ( newCategory > 0 ) params.category = newCategory;

    this.router.navigate( [ '/search', params ] );
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

  sortByValue( a, b ) {
    return a.value > b.value ? 1 : ( b.value > a.value ? -1 : 0 );
  }

  ngOnInit() {

    this.apiService.getCategories().subscribe( res => {
      if ( res.ack === 'Success' ) {
        console.log( res.categories.map( obj => [ +obj.id, obj.name ] ) )
        this.categories = new Map( res.categories.map( obj => [ +obj.id, obj.name ] ) );
        console.log( this.categories )
      }
    } );

    this.activatedRoute.paramMap.subscribe( params => {
      var query: IQuery = { query: params.get( 'query' ) }

      if ( params.has( 'page' ) ) {
        query.page = +params.get( 'page' );
      }

      if ( params.has( 'sortBy' ) ) {
        query.sortBy = params.get( 'sortBy' );
      }

      if ( params.has( 'listType' ) ) {
        query.listType = params.get( 'listType' );
      }

      if ( params.has( 'category' ) ) {
        query.category = params.get( 'category' );
      }

      console.log( query );

      this.apiService.searchItems( query ).subscribe( res => {
        if ( res.ack[ 0 ] == 'Success' ) {
          this.items = res.searchResult[ 0 ].item || [];
          this.pagination = res.paginationOutput[ 0 ];

          this.searchForm.patchValue( {
            query: query.query,
            page: +this.pagination.pageNumber,
            sortBy: +query.sortBy || 0,
            listType: +query.listType || 0,
            category: +query.category || 0
          } );

          this.setPages( +this.pagination.pageNumber[ 0 ], Math.min( 100, +this.pagination.totalPages[ 0 ] ), 8 );
          window.scroll( 0, 0 );
        } else {
          console.log( 'No Results' );
        }
      } );
    } );
  }
}