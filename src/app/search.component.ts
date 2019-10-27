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
  // sortings = [
  //   { sorting: 'Best Match', value: 0 },
  //   { sorting: 'Time Ending: Soonest', value: 1 },
  //   { sorting: 'New Listings', value: 2 },
  //   { sorting: 'Price: Low to High', value: 3 },
  // ]
  sortings = new Map( [
    [ 0, 'Best Match' ],
    [ 1, 'Time: Ending Soonest' ],
    [ 2, 'Time: Newly Listed' ],
    [ 3, 'Price+Shipping: Lowest First' ],
    [ 4, 'Price+Shipping' ]
  ] );

  searchForm = new FormGroup( {
    query: new FormControl( '' ),
    page: new FormControl( '' ),
    sort: new FormControl( '' )
  } );

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  onSubmit() {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( this.searchForm.value.sort > 0 ) params.sort = this.searchForm.value.sort;

    this.router.navigate( [ '/search', params ] );
  }

  changeSort( newSort: number ) {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( newSort > 0 ) params.sort = '' + newSort;

    this.router.navigate( [ '/search', params ] );
  }

  changePage( newPage: number ) {
    var params: IQuery = { query: this.searchForm.value.query }
    if ( this.searchForm.value.sort > 0 ) params.sort = this.searchForm.value.sort;
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

      console.log( query );

      this.apiService.searchItems( query ).subscribe( res => {
        if ( res.ack[ 0 ] == 'Success' ) {
          this.items = res.searchResult[ 0 ].item || [];
          this.pagination = res.paginationOutput[ 0 ];

          this.searchForm.patchValue( {
            query: query.query,
            page: +this.pagination.pageNumber,
            sort: +query.sort || 0
          } );

          this.setPages( +this.pagination.pageNumber[ 0 ], Math.min( 100, +this.pagination.totalPages[ 0 ] ), 8 );
          window.scroll( 0, 0 );
        }
        else {
          console.log( 'No Results' );
        }
      } );
    } );
  }
}