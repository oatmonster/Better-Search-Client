import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { IQuery } from '../api.service';

@Component( {
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.css' ]
} )
export class HomeComponent implements OnInit {

  searchForm = new FormGroup( {
    query: new FormControl( '' )
  } );

  constructor( private router: Router ) { }

  onSubmit() {
    console.log( '"' + this.searchForm.value.query + '"' );
    console.log( '"' + this.searchForm.value.query.trim() + '"' );
    this.searchForm.patchValue( {
      query: this.searchForm.value.query.trim()
    } );
    if ( this.searchForm.value.query !== '' ) {
      var params: IQuery = { query: this.searchForm.value.query }
      this.router.navigate( [ 'search', params ] );
    }
  }

  ngOnInit() {
  }

}
