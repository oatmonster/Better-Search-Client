import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { ApiService } from './api.service';
import { parseI18nMeta } from '@angular/compiler/src/render3/view/i18n';

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
  pagination: any;
  pages: number[];

  query: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  onSubmit() {
    this.router.navigate( [ '/search', {
      query: this.searchForm.value.query,
      page: this.searchForm.value.page
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

  toPage( newPage: number ) {
    this.searchForm.patchValue( { page: newPage } );
    this.onSubmit();
  }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe( params => {
      console.log( params );
      //this.searchForm.patchValue( params.get );
      this.searchForm.patchValue( { query: params.get( 'query' ) } );
      this.searchForm.patchValue( { page: params.get( 'page' ) } );

      this.apiService.searchItems( this.searchForm.value ).subscribe( res => {
        this.items = res.searchResult[ 0 ].item || [];
        this.pagination = res.paginationOutput[ 0 ];

        this.searchForm.patchValue( { page: +this.pagination.pageNumber[ 0 ] } );
        this.setPages( +this.pagination.pageNumber[ 0 ], +this.pagination.totalPages[ 0 ], 10 );
      } );
    } );
  }
}