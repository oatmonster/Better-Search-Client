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
export class HomeComponent {

  constructor( private searchService: SearchService ) { }

  searchForm = new FormGroup( {
    query: new FormControl(),
  } );

  submit() {
    this.searchService.navigate( this.searchForm.value, this.searchForm.value );
  }

}
