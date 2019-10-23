import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';

@Component( {
  selector: 'search',
  templateUrl: 'search.component.html',
} )
export class SearchComponent implements OnInit {

  items: any[];

  query;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  search( query: string ) {
    this.router.navigate( [ '/search', { keyword: query, foo: 'foo' } ] );
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      this.query = params.get( 'keyword' );
      this.apiService.searchItems( this.query ).subscribe( res => {
        this.items = res;
      } );
    } );
  }
}