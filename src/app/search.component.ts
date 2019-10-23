import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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
    this.router.navigateByUrl( 'search/' + query );
    this.apiService.searchItems( query ).subscribe( res => {
      this.items = res;
    } );
  }

  ngOnInit() {
    this.query = this.activatedRoute.snapshot.params[ 'query' ];
    this.apiService.searchItems( this.query ).subscribe( res => {
      this.items = res;
    } );
  }
}