import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ApiService } from './api.service';
import { IQuery } from './api.service';

@Component( {
  selector: 'search',
  templateUrl: 'search.component.html',
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

  searchForm = new FormGroup( {
    query: new FormControl( '' ),
    page: new FormControl( '' ),
    sortBy: new FormControl( '' ),
    listType: new FormControl( '' )
  } );

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  onSubmit() {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( this.searchForm.value.sort > 0 ) params.sort = this.searchForm.value.sortBy;
    if ( this.searchForm.value.listingType > 0 ) params.listType = this.searchForm.value.listingType;

    this.router.navigate( [ '/search', params ] );
  }

  changeSort( newSort: number ) {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( newSort > 0 ) params.sort = '' + newSort;
    if ( this.searchForm.value.listingType > 0 ) params.listType = this.searchForm.value.listingType;

    this.router.navigate( [ '/search', params ] );
  }

  changeType( newType: number ) {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( newType > 0 ) params.listType = '' + newType;
    if ( this.searchForm.value.sortBy > 0 ) params.sort = this.searchForm.value.sortBy;

    this.router.navigate( [ '/search', params ] );
  }

  changePage( newPage: number ) {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( this.searchForm.value.sortBy > 0 ) params.sort = this.searchForm.value.sortBy;
    if ( this.searchForm.value.listingType > 0 ) params.listType = this.searchForm.value.listingType;
    if ( newPage > 1 ) params.page = newPage;

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

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe( params => {
      var query: IQuery = { query: params.get( 'query' ) }

      if ( params.has( 'page' ) ) {
        query.page = +params.get( 'page' );
      }

      if ( params.has( 'sort' ) ) {
        query.sort = params.get( 'sort' );
      }

      if ( params.has( 'listType' ) ) {
        query.listType = params.get( 'listType' );
      }

      console.log( query );
      console.log( 'Controls: ', this.searchForm.controls );

      this.apiService.searchItems( query ).subscribe( res => {
        if ( res.ack[ 0 ] == 'Success' ) {
          this.items = res.searchResult[ 0 ].item || [];
          this.pagination = res.paginationOutput[ 0 ];

          this.searchForm.patchValue( {
            query: query.query,
            page: +this.pagination.pageNumber,
            sortBy: +query.sort || 0,
            listType: +query.listType || 0
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