import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { IQuery } from '../common/api.service';
import { SearchService } from '../common/search.service';

@Component( {
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
} )
export class HomeComponent implements OnInit {

  searchForm = new FormGroup( {
    query: new FormControl( '' )
  } );

  constructor( private router: Router, private searchService: SearchService ) { }

  submit() {
    console.log( this.searchForm.value );
    this.searchService.navigate( this.searchForm.value, this.searchForm.value );
    // this.searchForm.patchValue( {
    //   query: this.searchForm.value.query.trim()
    // } );
    // if ( this.searchForm.value.query !== '' ) {
    //   let params: IQuery = { query: this.searchForm.value.query };
    //   this.router.navigate( [ 'search', params ] );
    // }
  }

  ngOnInit() { }

}
