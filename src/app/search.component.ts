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

  searchForm = new FormGroup( {
    query: new FormControl( '' ),
    page: new FormControl( '' ),
  } );

  items: any[];
  pagination: any = {};
  pages: number[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  onSubmit() {
    console.log( 'submit' );
    this.router.navigate( [ '/search', {
      query: this.searchForm.value.query,
      page: 1
    } ] );
  }

  toPage( newPage: number ) {
    console.log( newPage );
    this.router.navigate( [ '/search', {
      query: this.searchForm.value.query,
      page: newPage
    } ] );
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
      console.log( params );
      var query: IQuery = {
        query: params.get( 'query' ),
      }

      if ( params.has( 'page' ) ) {
        query.page = +params.get( 'page' )
      }

      console.log( query );

      this.apiService.searchItems( query ).subscribe( res => {
        this.items = res.searchResult[ 0 ].item || [];
        this.pagination = res.paginationOutput[ 0 ];

        this.searchForm.patchValue( { query: query.query, page: +this.pagination.pageNumber[ 0 ] } );

        this.setPages( +this.pagination.pageNumber[ 0 ], Math.min( 100, +this.pagination.totalPages[ 0 ] ), 10 );
        window.scroll( 0, 0 );

      } );
    } );
  }
}